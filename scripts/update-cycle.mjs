#!/usr/bin/env node
/**
 * Trump Files Update Cycle
 *
 * Usage: node scripts/update-cycle.mjs [--dry-run] [--skip-research] [--skip-validate]
 *
 * Steps:
 * 1. Research: Query for new Trump events since last entry date
 * 2. Validate: Score and verify candidates
 * 3. Publish: Upload validated entries via secure API
 * 4. Verify: Confirm entry count matches expected
 *
 * Requires env vars:
 *   DATABASE_URL - Neon connection string
 *   INGESTION_SECRET - Bearer token for upload API
 *   OPENAI_API_KEY or ANTHROPIC_API_KEY - for scoring/validation
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
const INGESTION_SECRET = process.env.INGESTION_SECRET;
const SITE_URL = process.env.SITE_URL || 'https://trumpfiles.fun';
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_RESEARCH = process.argv.includes('--skip-research');
const SKIP_VALIDATE = process.argv.includes('--skip-validate');

if (!DATABASE_URL) {
  console.error('DATABASE_URL required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function getLastEntryDate() {
  const result = await sql`
    SELECT MAX(date_start) as last_date, MAX(entry_number) as max_entry
    FROM trump_entries
  `;
  return {
    lastDate: result[0]?.last_date || '2026-07-02',
    maxEntry: parseInt(result[0]?.max_entry || '4204', 10)
  };
}

async function getCurrentCount() {
  const result = await sql`SELECT COUNT(*) as count FROM ai_complete_trump_data`;
  return parseInt(result[0]?.count || '0', 10);
}

async function getStagedCandidates() {
  const result = await sql`
    SELECT * FROM staged_candidates
    WHERE review_status = 'approved'
    ORDER BY date_start ASC
  `;
  return result;
}

async function publishEntries(entries) {
  if (!INGESTION_SECRET) {
    console.error('INGESTION_SECRET required for publishing');
    return null;
  }

  const idempotencyKey = `cycle-${new Date().toISOString().split('T')[0]}-${entries.length}`;

  const response = await fetch(`${SITE_URL}/api/upload-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INGESTION_SECRET}`,
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(entries),
  });

  return response.json();
}

async function verifyCount(expectedIncrease, previousCount) {
  const newCount = await getCurrentCount();
  const actualIncrease = newCount - previousCount;
  return {
    success: actualIncrease === expectedIncrease,
    previousCount,
    newCount,
    expectedIncrease,
    actualIncrease,
  };
}

async function run() {
  console.log('=== Trump Files Update Cycle ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  const { lastDate, maxEntry } = await getLastEntryDate();
  const currentCount = await getCurrentCount();
  console.log(`Current state: ${currentCount} entries, last date: ${lastDate}, max entry: #${maxEntry}`);

  if (!SKIP_RESEARCH) {
    console.log('\n--- Step 1: Research ---');
    console.log(`Would research events from ${lastDate} to today`);
    console.log('(Research step requires AI agent - run via Claude Code or agy)');
    console.log('Stage candidates with: INSERT INTO staged_candidates (...)');
  }

  if (!SKIP_VALIDATE) {
    console.log('\n--- Step 2: Validate ---');
    const candidates = await getStagedCandidates();
    console.log(`Found ${candidates.length} approved candidates ready to publish`);

    if (candidates.length === 0) {
      console.log('No approved candidates. Stage and approve entries first.');
      console.log('Use: UPDATE staged_candidates SET review_status = \'approved\' WHERE id = ...');
      return;
    }

    console.log('\n--- Step 3: Publish ---');
    const entries = candidates.map((c, i) => ({
      entry_number: maxEntry + i + 1,
      title: c.title,
      date_start: c.date_start,
      date_end: c.date_end,
      synopsis: c.synopsis,
      category: c.category,
      subcategory: c.subcategory,
      keywords: [],
      age: null,
      phase: null,
      fact_check: null,
      fact_check_sources: null,
      rationale: null,
      scores: c.scores || {},
    }));

    if (DRY_RUN) {
      console.log(`Would publish ${entries.length} entries (${maxEntry + 1} to ${maxEntry + entries.length})`);
      entries.slice(0, 3).forEach(e => console.log(`  #${e.entry_number}: ${e.title}`));
      if (entries.length > 3) console.log(`  ... and ${entries.length - 3} more`);
      return;
    }

    const result = await publishEntries(entries);
    console.log('Publish result:', JSON.stringify(result, null, 2));

    if (result?.inserted > 0) {
      await sql`
        UPDATE staged_candidates
        SET review_status = 'approved', published_at = NOW()
        WHERE review_status = 'approved' AND published_at IS NULL
      `;
    }

    console.log('\n--- Step 4: Verify ---');
    const verification = await verifyCount(result?.inserted || 0, currentCount);
    if (verification.success) {
      console.log(`Verified: ${verification.previousCount} -> ${verification.newCount} (+${verification.actualIncrease})`);
    } else {
      console.error(`MISMATCH: expected +${verification.expectedIncrease}, got +${verification.actualIncrease}`);
      console.error(`Count: ${verification.previousCount} -> ${verification.newCount}`);
    }
  }

  console.log('\n=== Cycle complete ===');
}

run().catch(err => {
  console.error('Cycle failed:', err);
  process.exit(1);
});
