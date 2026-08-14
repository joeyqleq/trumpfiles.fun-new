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

// ── Gemini research call ──────────────────────────────────────────────────────

async function researchWithGemini(lastDate, maxEntry) {
  const today = new Date().toISOString().split('T')[0];

  const prompt = `You are a researcher for TrumpFiles, a political accountability archive covering Trump and his orbit.

Today is ${today}. The database currently has ${maxEntry} entries, most recently dated ${lastDate}.

Research and produce up to ${MAX_ENTRIES} NEW entries about events from roughly ${lastDate} onwards.

NARRATIVE FOCUS — entries must fit this lens:
- Authoritarianism, institutional destruction, abuse of power
- Financial corruption, self-dealing, grift
- Human rights violations, cruelty
- Election interference, democratic backsliding
- Foreign policy disasters, foreign entanglements for personal gain
- Environmental destruction
- Disinformation, conspiracy theories weaponized for political gain
- Suppression of press, judiciary, civil society

INCLUDE: Trump, his family (Ivanka, Don Jr., Eric, Barron, Melania, Jared Kushner), his key appointments (Kash Patel, Pete Hegseth, Doug Burgum, Marco Rubio, JD Vance, Elon Musk/DOGE), and his broader orbit.

INCLUDE EVEN IF UNVERIFIED: Reddit rumors, gossip, speculation — just mark absurdity higher and credibility_risk lower. The archive values completeness.

EXCLUDE: Routine political disagreements, policy debates without a scandal angle.

Return a JSON array of objects. Each object MUST have these exact fields:
{
  "title": "Specific punchy headline (not vague)",
  "synopsis": "3-5 sentences. Specific facts, dates, people, dollar amounts. NO vague language.",
  "category": one of exactly: "Authoritarianism" | "Government Corruption" | "Human Rights Violations" | "Grift / Financial Exploitation" | "National Security Violations" | "Foreign Policy" | "Election Interference" | "Press Freedom" | "Environmental Destruction" | "Conspiracy Theories / Disinformation",
  "phase": one of exactly: "Pre-Political" | "Campaign 2016" | "White House 1" | "White House 2:2",
  "date_start": "YYYY-MM-DD",
  "people_tags": ["Person Name", "Org Name", ...],
  "danger": 1-10,
  "authoritarianism": 1-10,
  "lawlessness": 1-10,
  "insanity": 1-10,
  "absurdity": 1-10
}

Return ONLY valid JSON array, no markdown, no explanation.`;

  // First: use Exa to search for recent Trump news to give Gemini real context
  let newsContext = '';
  if (EXA_KEYS.length > 0) {
    try {
      const exaKey = EXA_KEYS[0];
      const exaRes = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': exaKey },
        body: JSON.stringify({
          query: `Trump scandal corruption news since ${lastDate}`,
          numResults: 8,
          contents: { text: { maxCharacters: 400 } },
          useAutoprompt: true,
          startPublishedDate: lastDate,
        }),
      });
      if (exaRes.ok) {
        const exaData = await exaRes.json();
        const articles = (exaData.results ?? [])
          .map(r => `HEADLINE: ${r.title}\nSOURCE: ${r.url}\nDATE: ${r.publishedDate ?? ''}\nSUMMARY: ${r.text ?? ''}`)
          .join('\n\n---\n\n');
        if (articles) {
          newsContext = `\n\nRECENT NEWS FROM THE WEB (use these as source material):\n${articles}\n\nFor each entry you generate, use the matching article URL as the source.`;
        }
      }
    } catch (e) {
      console.log('Exa search failed, continuing without live news:', e.message);
    }
  }

  // Then: ask Gemini to format findings as structured entries
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt + newsContext }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

  let entries;
  try {
    entries = JSON.parse(text);
  } catch {
    // strip markdown fences if present
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    entries = JSON.parse(clean);
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

  await sql`
    INSERT INTO trump_entries (entry_number, title, synopsis, category, phase, date_start, people_tags)
    VALUES (
      ${entryNumber},
      ${entry.title},
      ${entry.synopsis},
      ${entry.category},
      ${entry.phase},
      ${entry.date_start},
      ${tags}
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
