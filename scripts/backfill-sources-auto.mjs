#!/usr/bin/env node
/**
 * Automated source backfill using Exa REST API (no MCP, no Claude tokens)
 * Run by GitHub Actions cron or manually:
 *   EXA_API_KEY=... DATABASE_URL=... node scripts/backfill-sources-auto.mjs
 *
 * Env vars:
 *   DATABASE_URL   — Neon connection string
 *   EXA_API_KEY    — Exa API key (free tier: 1000 req/month)
 *   BATCH_SIZE     — entries per run (default 100)
 *   START_ENTRY    — start of range (default: auto-detect lowest unsourced)
 *   END_ENTRY      — end of range (default: 9999)
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
const EXA_API_KEY = process.env.EXA_API_KEY;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE ?? '100', 10);
const START_ENTRY = parseInt(process.env.START_ENTRY ?? '0', 10);
const END_ENTRY = parseInt(process.env.END_ENTRY ?? '9999', 10);

if (!DATABASE_URL) { console.error('DATABASE_URL required'); process.exit(1); }
if (!EXA_API_KEY) { console.error('EXA_API_KEY required'); process.exit(1); }

const sql = neon(DATABASE_URL);

// Accepted reputable outlets
const ACCEPTED_DOMAINS = [
  'reuters.com', 'apnews.com', 'nytimes.com', 'washingtonpost.com',
  'cnn.com', 'bbc.com', 'bbc.co.uk', 'politico.com', 'theguardian.com',
  'nbcnews.com', 'npr.org', 'cnbc.com', 'theatlantic.com', 'axios.com',
  'propublica.org', 'cbsnews.com', 'abcnews.go.com', 'pbs.org',
  'vox.com', 'newyorker.com', 'texastribune.org', 'thehill.com',
  'nbcnews.com', 'dailybeast.com', 'politifact.com', 'time.com',
  'bloomberg.com', 'ft.com', 'wsj.com', 'usatoday.com',
];

function isAccepted(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return ACCEPTED_DOMAINS.some(d => host === d || host.endsWith('.' + d));
  } catch { return false; }
}

async function searchExa(query) {
  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_API_KEY },
    body: JSON.stringify({ query, numResults: 3, useAutoprompt: false }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const results = data.results ?? [];
  return results.find(r => isAccepted(r.url)) ?? null;
}

async function run() {
  console.log(`Starting backfill: entries ${START_ENTRY}–${END_ENTRY}, batch ${BATCH_SIZE}`);

  // Find entries missing sources
  const rows = await sql`
    SELECT entry_number, title, date_start
    FROM trump_entries
    WHERE entry_number BETWEEN ${START_ENTRY || 1} AND ${END_ENTRY}
      AND (sources IS NULL OR sources::text = 'null' OR sources::text = '[]')
    ORDER BY entry_number
    LIMIT ${BATCH_SIZE}
  `;

  console.log(`Found ${rows.length} entries without sources`);
  if (rows.length === 0) { console.log('All entries sourced in this range!'); return; }

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const year = row.date_start ? new Date(row.date_start).getFullYear() : '';
    const query = `${row.title} ${year}`.trim();

    let result = await searchExa(query);

    // Retry with simplified query
    if (!result) {
      const simplified = row.title
        .replace(/^Trump['']s?\s+/i, '')
        .replace(/^Donald Trump\s+/i, '')
        .slice(0, 80);
      result = await searchExa(`${simplified} ${year}`);
    }

    if (result) {
      await sql`
        UPDATE trump_entries
        SET sources = ${JSON.stringify([{ url: result.url, title: result.title ?? row.title, source_type: 'news' }])}::jsonb
        WHERE entry_number = ${row.entry_number}
      `;
      updated++;
      if (updated % 10 === 0) console.log(`  ${updated} updated...`);
    } else {
      skipped++;
    }

    // Rate limit: ~1 req/sec to stay within free tier
    await new Promise(r => setTimeout(r, 250));
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);

  // Report remaining
  const [remaining] = await sql`
    SELECT COUNT(*) as c FROM trump_entries
    WHERE entry_number BETWEEN ${START_ENTRY || 1} AND ${END_ENTRY}
      AND (sources IS NULL OR sources::text = 'null' OR sources::text = '[]')
  `;
  console.log(`Remaining unsourced in range: ${remaining.c}`);
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
