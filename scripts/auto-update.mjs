#!/usr/bin/env node
/**
 * Trump Files — Automated Entry Update
 *
 * Provider-agnostic research pipeline. Any AI agent can call this.
 * Uses Gemini (via agy) for research to preserve Claude/Bedrock quota.
 *
 * Steps:
 *   1. Query DB for current max entry_number + last date
 *   2. Call Gemini to research new Trump events since last update
 *   3. Format entries to DB schema
 *   4. Validate structure (required fields, category vocabulary, phase)
 *   5. INSERT directly into Neon (bypasses upload API for cron reliability)
 *   6. Trigger Vectorize ingest on Cloudflare Worker
 *
 * Env vars:
 *   DATABASE_URL      — Neon connection string
 *   GEMINI_API_KEY    — Google AI Studio key (free tier OK for cron)
 *   INGEST_SECRET     — CF Worker bearer token
 *   WORKER_URL        — Cloudflare Worker base URL
 *   DRY_RUN           — 'true' to skip DB writes
 *   MAX_ENTRIES       — max entries to insert per run (default 10)
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // no longer required — kept for backward compat
const INGEST_SECRET = process.env.INGEST_SECRET;
const WORKER_URL = process.env.WORKER_URL || 'https://trumpstein.trumpstein.workers.dev';
const DRY_RUN = process.env.DRY_RUN === 'true';
const MAX_ENTRIES = parseInt(process.env.MAX_ENTRIES || '10', 10);

// Exa key rotation — cycle through available keys to distribute load
const EXA_KEYS = [
  process.env.EXA_API_KEY,
  process.env.EXA_API_KEY_2,
  process.env.EXA_API_KEY_3,
].filter(Boolean);
let exaKeyIndex = 0;
const getExaKey = () => EXA_KEYS[exaKeyIndex++ % EXA_KEYS.length];

if (!DATABASE_URL) { console.error('DATABASE_URL required'); process.exit(1); }
if (!INGEST_SECRET) { console.error('INGEST_SECRET required'); process.exit(1); }

const sql = neon(DATABASE_URL);

// ── Schema constants ──────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'Authoritarianism',
  'Government Corruption',
  'Human Rights Violations',
  'Grift / Financial Exploitation',
  'National Security Violations',
  'Foreign Policy',
  'Election Interference',
  'Press Freedom',
  'Environmental Destruction',
  'Conspiracy Theories / Disinformation',
];

const VALID_PHASES = [
  'Pre-Political',
  'Campaign 2016',
  'White House 1',
  'White House 2:2',
];

// ── DB helpers ────────────────────────────────────────────────────────────────

async function getState() {
  const rows = await sql`
    SELECT MAX(entry_number) as max_entry, MAX(date_start) as last_date
    FROM trump_entries
  `;
  return {
    maxEntry: parseInt(rows[0]?.max_entry || '5000', 10),
    lastDate: rows[0]?.last_date
      ? new Date(rows[0].last_date).toISOString().split('T')[0]
      : '2026-08-01',
  };
}

// ── Research: Exa (mandatory) + CF Workers AI to structure ───────────────────

async function researchAndStructure(lastDate, maxEntry) {
  // FAIL CLOSED: no Exa keys = no run
  if (EXA_KEYS.length === 0) {
    throw new Error('No EXA_API_KEY configured. Cannot research without real sources.');
  }

  // Step 1: Fetch real recent Trump news via Exa (MANDATORY)
  let articles = [];
  const exaKey = getExaKey();
  const exaRes = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': exaKey },
    body: JSON.stringify({
      query: `Trump scandal corruption abuse power news`,
      numResults: MAX_ENTRIES + 2, // fetch a few extra in case some fail validation
      contents: { text: { maxCharacters: 600 } },
      useAutoprompt: true,
      startPublishedDate: lastDate, // ISO date string e.g. "2026-08-09"
    }),
  });

  if (!exaRes.ok) {
    const errText = await exaRes.text();
    throw new Error(`Exa search failed ${exaRes.status}: ${errText}`);
  }

  const exaData = await exaRes.json();
  articles = (exaData.results ?? []).filter(r => r.url && !r.url.includes('example.com'));

  if (articles.length === 0) {
    throw new Error(`Exa returned 0 real articles since ${lastDate}. Aborting — no fabrication allowed.`);
  }

  console.log(`Exa found ${articles.length} real articles since ${lastDate}`);

  // Step 2: Build article map keyed by URL for reliable source attachment
  const articleByUrl = new Map(articles.map(a => [a.url, a]));

  // Step 3: Ask CF Workers AI to structure articles — ONLY articles provided, no invention
  const systemPrompt = `You are a data curator for TrumpFiles. Convert the provided news articles into structured JSON entries.

STRICT RULES:
- ONLY create entries for the articles explicitly provided below
- NEVER invent events, quotes, dollar amounts, names, or crimes
- NEVER generate placeholder or example.com URLs
- Each entry's source_url MUST exactly match one of the article URLs provided
- If an article is not about Trump misconduct/scandal, skip it

VALID CATEGORIES (use EXACTLY one): "Authoritarianism" | "Government Corruption" | "Human Rights Violations" | "Grift / Financial Exploitation" | "National Security Violations" | "Foreign Policy" | "Election Interference" | "Press Freedom" | "Environmental Destruction" | "Conspiracy Theories / Disinformation"

VALID PHASES (use EXACTLY one): "Pre-Political" | "Campaign 2016" | "White House 1" | "White House 2:2"

Return ONLY a valid JSON array. No markdown, no explanation, no invented content.`;

  const newsContext = articles.map(r =>
    `ARTICLE_URL: ${r.url}\nHEADLINE: ${r.title}\nDATE: ${r.publishedDate ?? ''}\nSUMMARY: ${r.text ?? ''}`
  ).join('\n\n---\n\n');

  const userPrompt = `Structure the following ${articles.length} real news articles as TrumpFiles entries.
For each relevant article return ONE JSON object:
{
  "title": "punchy specific headline based on the article",
  "synopsis": "3-5 sentences with specific facts from the article",
  "category": "<valid category>",
  "phase": "White House 2:2",
  "date_start": "YYYY-MM-DD (from article date)",
  "people_tags": ["Full Name"],
  "source_url": "<EXACT article URL from ARTICLE_URL field above>",
  "danger": 1-10,
  "authoritarianism": 1-10,
  "lawlessness": 1-10,
  "insanity": 1-10,
  "absurdity": 1-10
}

ARTICLES:
${newsContext}

Return ONLY valid JSON array. Skip articles unrelated to Trump misconduct.`;

  const workerUrl = WORKER_URL || 'https://trumpstein.trumpstein.workers.dev';
  const cfRes = await fetch(`${workerUrl}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${INGEST_SECRET}` },
    body: JSON.stringify({ system: systemPrompt, user: userPrompt, max_tokens: 4096 }),
  });

  if (!cfRes.ok) throw new Error(`CF Workers AI error ${cfRes.status}: ${await cfRes.text()}`);

  const cfData = await cfRes.json();
  const rawText = cfData.response ?? cfData.text ?? '[]';

  // Parse, stripping QwQ <think> tokens
  let entries = [];
  try {
    const stripped = rawText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const jsonMatch = stripped.match(/\[[\s\S]*\]/);
    entries = JSON.parse(jsonMatch ? jsonMatch[0] : stripped);
  } catch {
    console.warn('JSON parse failed, returning empty');
    return [];
  }

  if (!Array.isArray(entries)) return [];

  // Step 4: Attach ONLY Exa-verified source URLs — reject any LLM-invented URLs
  const verified = entries
    .map(e => {
      const url = e.source_url;
      if (!url) return null; // no source = skip
      if (url.includes('example.com') || url.includes('placeholder')) return null; // fabricated
      const exaArticle = articleByUrl.get(url);
      if (!exaArticle) {
        // Try partial match (model may have slightly mangled URL)
        const partialMatch = articles.find(a => a.url.includes(new URL(url).pathname.slice(0, 20)));
        if (!partialMatch) {
          console.warn(`SKIP (URL not from Exa): ${url}`);
          return null;
        }
        return { ...e, sources: [{ url: partialMatch.url, title: partialMatch.title, source_type: 'news' }] };
      }
      return { ...e, sources: [{ url: exaArticle.url, title: exaArticle.title, source_type: 'news' }] };
    })
    .filter(Boolean);

  return verified;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(entry) {
  const errors = [];
  if (!entry.title || entry.title.length < 10) errors.push('title too short');
  if (!entry.synopsis || entry.synopsis.length < 50) errors.push('synopsis too short');
  if (!VALID_CATEGORIES.includes(entry.category)) errors.push(`invalid category: ${entry.category}`);
  if (!VALID_PHASES.includes(entry.phase)) errors.push(`invalid phase: ${entry.phase}`);
  if (!entry.date_start || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date_start)) errors.push('invalid date_start');
  // HARD REQUIREMENT: must have a real Exa-sourced URL
  const sourceUrl = entry.sources?.[0]?.url;
  if (!sourceUrl) errors.push('no verified source URL');
  if (sourceUrl?.includes('example.com') || sourceUrl?.includes('placeholder')) errors.push('placeholder URL rejected');
  return errors;
}

// ── DB insert ─────────────────────────────────────────────────────────────────

async function insertEntry(entry, entryNumber) {
  const tags = Array.isArray(entry.people_tags) ? entry.people_tags : ['Donald Trump'];

  const sourcesJson = entry.sources ? JSON.stringify(entry.sources) : null;

  await sql`
    INSERT INTO trump_entries (entry_number, title, synopsis, category, phase, date_start, people_tags, sources)
    VALUES (
      ${entryNumber},
      ${entry.title},
      ${entry.synopsis},
      ${entry.category},
      ${entry.phase},
      ${entry.date_start},
      ${tags},
      ${sourcesJson ? sql`${sourcesJson}::jsonb` : null}
    )
    ON CONFLICT (entry_number) DO NOTHING
  `;

  await sql`
    INSERT INTO trump_individual_scores
      (entry_number, danger, authoritarianism, lawlessness, insanity, absurdity, credibility_risk, recency_intensity, impact_scope)
    VALUES (
      ${entryNumber},
      ${entry.danger || 5},
      ${entry.authoritarianism || 5},
      ${entry.lawlessness || 5},
      ${entry.insanity || 5},
      ${entry.absurdity || 5},
      5,
      5,
      5
    )
    ON CONFLICT (entry_number) DO NOTHING
  `;
}

// ── Vectorize trigger ─────────────────────────────────────────────────────────

async function triggerVectorize(offset, limit) {
  if (!INGEST_SECRET) {
    console.log('INGEST_SECRET not set, skipping vectorize trigger');
    return;
  }
  const res = await fetch(`${WORKER_URL}/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${INGEST_SECRET}`,
    },
    body: JSON.stringify({ offset, limit }),
  });
  const data = await res.json();
  console.log(`Vectorize: ${JSON.stringify(data)}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`=== Trump Files Auto-Update [${DRY_RUN ? 'DRY RUN' : 'LIVE'}] ===`);
  console.log(`Date: ${new Date().toISOString()}`);

  const { maxEntry, lastDate } = await getState();
  console.log(`DB state: max entry #${maxEntry}, last date ${lastDate}`);

  console.log('\nResearching via Exa + CF Workers AI (fail-closed)...');
  let candidates;
  try {
    candidates = await researchAndStructure(lastDate, maxEntry);
  } catch (err) {
    console.error('Research failed:', err.message);
    process.exit(1);
  }
  console.log(`Got ${candidates.length} Exa-sourced candidate entries`);

  const valid = [];
  for (const entry of candidates) {
    const errors = validate(entry);
    if (errors.length > 0) {
      console.warn(`SKIP [${entry.title?.slice(0, 40)}]: ${errors.join(', ')}`);
    } else {
      valid.push(entry);
    }
  }
  console.log(`${valid.length} passed validation`);

  if (valid.length === 0) {
    console.log('Nothing to insert. Exiting.');
    return;
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — entries that would be inserted:');
    valid.forEach((e, i) => console.log(`  #${maxEntry + i + 1}: ${e.title}`));
    return;
  }

  console.log('\nInserting...');
  let inserted = 0;
  for (let i = 0; i < valid.length; i++) {
    const num = maxEntry + i + 1;
    try {
      await insertEntry(valid[i], num);
      console.log(`  #${num}: ${valid[i].title.slice(0, 60)}`);
      inserted++;
    } catch (err) {
      console.error(`  FAIL #${num}: ${err.message}`);
    }
  }

  console.log(`\nInserted ${inserted} entries (#${maxEntry + 1}–#${maxEntry + inserted})`);

  if (inserted > 0) {
    // Vectorize using ROW COUNT offset, not entry number
    // Query the actual row count before the new entries to get correct offset
    const [countRow] = await sql`SELECT COUNT(*) as c FROM trump_entries`;
    const totalRows = parseInt(countRow.c, 10);
    const vectorizeOffset = totalRows - inserted; // rows before the new batch
    console.log(`\nTriggering vectorize for ${inserted} new rows (offset=${vectorizeOffset})...`);
    await triggerVectorize(vectorizeOffset, inserted);
  }

  console.log('\n=== Done ===');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
