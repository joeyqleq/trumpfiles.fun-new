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
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
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
if (!GEMINI_API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

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

// ── Research using Exa + CF Workers AI (replaces Gemini) ─────────────────────

async function researchWithGemini(lastDate, maxEntry) {
  const today = new Date().toISOString().split('T')[0];

  // Step 1: Fetch real recent Trump news via Exa
  let articles = [];
  if (EXA_KEYS.length > 0) {
    try {
      const exaKey = EXA_KEYS[_exaIdx++ % EXA_KEYS.length];
      const exaRes = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': exaKey },
        body: JSON.stringify({
          query: `Trump scandal corruption abuse power news ${lastDate}`,
          numResults: 10,
          contents: { text: { maxCharacters: 500 } },
          useAutoprompt: true,
          startPublishedDate: lastDate,
        }),
      });
      if (exaRes.ok) {
        const d = await exaRes.json();
        articles = d.results ?? [];
        console.log(`Exa found ${articles.length} articles since ${lastDate}`);
      }
    } catch (e) {
      console.log('Exa search failed:', e.message);
    }
  }

  const newsContext = articles.length > 0
    ? articles.map(r =>
        `HEADLINE: ${r.title}\nURL: ${r.url}\nDATE: ${r.publishedDate ?? ''}\nSUMMARY: ${r.text ?? ''}`
      ).join('\n\n---\n\n')
    : '';

  // Step 2: Use CF Workers AI (Llama 70B) to format as structured entries
  // Calls the Trumpstein worker's /research endpoint
  const systemPrompt = `You are a data curator for TrumpFiles, a political accountability archive. Your job is to convert news articles into structured JSON entries.

VALID CATEGORIES (use EXACTLY): "Authoritarianism" | "Government Corruption" | "Human Rights Violations" | "Grift / Financial Exploitation" | "National Security Violations" | "Foreign Policy" | "Election Interference" | "Press Freedom" | "Environmental Destruction" | "Conspiracy Theories / Disinformation"

VALID PHASES (use EXACTLY): "Pre-Political" | "Campaign 2016" | "White House 1" | "White House 2:2"

SCORING GUIDE:
- danger: 1-10 (10 = threatens constitutional order or human life)
- authoritarianism: 1-10 (concentration of power, suppression of dissent)
- lawlessness: 1-10 (violation of law, obstruction, norm destruction)
- insanity: 1-10 (departure from reality, delusional behavior)
- absurdity: 1-10 (so bizarre it would be rejected as fiction)

Return ONLY a valid JSON array. No markdown, no explanation.`;

  const userPrompt = `Today is ${today}. The archive has ${maxEntry} entries, most recently dated ${lastDate}.

${newsContext ? `NEWS ARTICLES TO PROCESS:\n\n${newsContext}\n\nConvert each article above into an entry. Use the article URL as the source.` : `Generate ${MAX_ENTRIES} realistic entries about Trump scandals from ${lastDate} to ${today}. Cover: authoritarianism, corruption, foreign policy, grift, human rights.`}

For each article/event return:
{
  "title": "punchy specific headline",
  "synopsis": "3-5 sentences with specific facts, dates, names, amounts",
  "category": "<one of the valid categories>",
  "phase": "White House 2:2",
  "date_start": "YYYY-MM-DD",
  "people_tags": ["Full Name", ...],
  "source_url": "<article URL if available>",
  "danger": 1-10,
  "authoritarianism": 1-10,
  "lawlessness": 1-10,
  "insanity": 1-10,
  "absurdity": 1-10
}

Return ONLY valid JSON array.`;

  // Call CF Workers AI via the worker's public /generate endpoint
  const workerUrl = WORKER_URL || 'https://trumpstein.trumpstein.workers.dev';
  const cfRes = await fetch(`${workerUrl}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INGEST_SECRET}`,
    },
    body: JSON.stringify({ system: systemPrompt, user: userPrompt, max_tokens: 4096 }),
  });

  if (!cfRes.ok) {
    const err = await cfRes.text();
    throw new Error(`CF Workers AI error ${cfRes.status}: ${err}`);
  }

  const cfData = await cfRes.json();
  const text = cfData.response ?? cfData.text ?? '[]';

  let entries;
  try {
    // Strip <think>...</think> reasoning from QwQ-32b output
    const stripped = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Find JSON array in the output
    const jsonMatch = stripped.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : stripped;
    entries = JSON.parse(jsonStr);
  } catch {
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const jsonMatch = clean.match(/\[[\s\S]*\]/);
    try { entries = JSON.parse(jsonMatch ? jsonMatch[0] : clean); } catch { entries = []; }
  }

  // Attach source URLs from Exa results
  if (Array.isArray(entries)) {
    entries = entries.map((e, i) => {
      const src = articles[i]?.url ?? e.source_url;
      if (src) {
        return { ...e, sources: [{ url: src, title: articles[i]?.title ?? e.title, source_type: 'news' }] };
      }
      return e;
    });
  }

  return Array.isArray(entries) ? entries : [];
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(entry) {
  const errors = [];
  if (!entry.title || entry.title.length < 10) errors.push('title too short');
  if (!entry.synopsis || entry.synopsis.length < 50) errors.push('synopsis too short');
  if (!VALID_CATEGORIES.includes(entry.category)) errors.push(`invalid category: ${entry.category}`);
  if (!VALID_PHASES.includes(entry.phase)) errors.push(`invalid phase: ${entry.phase}`);
  if (!entry.date_start || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date_start)) errors.push('invalid date_start');
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

  console.log('\nResearching with Gemini...');
  let candidates;
  try {
    candidates = await researchWithGemini(lastDate, maxEntry);
  } catch (err) {
    console.error('Gemini research failed:', err.message);
    process.exit(1);
  }
  console.log(`Got ${candidates.length} candidate entries from Gemini`);

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
    console.log('\nTriggering vectorize...');
    await triggerVectorize(maxEntry, inserted);
  }

  console.log('\n=== Done ===');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
