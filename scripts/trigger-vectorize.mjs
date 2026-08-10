#!/usr/bin/env node
/**
 * Trigger Vectorize ingest on the Cloudflare Worker
 * for all unvectorized rows (rows beyond current vector count)
 */
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
const INGEST_SECRET = process.env.INGEST_SECRET;
const WORKER_URL = process.env.WORKER_URL || 'https://trumpstein.trumpstein.workers.dev';

if (!INGEST_SECRET) { console.error('INGEST_SECRET required'); process.exit(1); }

const BATCH = 50;

async function getRowCount() {
  if (!DATABASE_URL) return null;
  const sql = neon(DATABASE_URL);
  const rows = await sql`SELECT COUNT(*) as count FROM trump_entries`;
  return parseInt(rows[0].count, 10);
}

async function ingest(offset, limit) {
  const res = await fetch(`${WORKER_URL}/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${INGEST_SECRET}`,
    },
    body: JSON.stringify({ offset, limit }),
  });
  return res.json();
}

async function run() {
  const total = await getRowCount();
  if (!total) {
    console.error('Cannot determine row count — DATABASE_URL missing or query failed');
    process.exit(1);
  }

  const offset = parseInt(process.env.VECTORIZE_FROM || '0', 10);
  const limit = total - offset;

  if (limit <= 0) {
    console.log(`Nothing to vectorize (offset=${offset}, total=${total})`);
    return;
  }

  console.log(`Vectorizing rows ${offset}–${total - 1} (${limit} rows) in batches of ${BATCH}`);

  let done = 0;
  for (let pos = offset; pos < total; pos += BATCH) {
    const batchLimit = Math.min(BATCH, total - pos);
    const result = await ingest(pos, batchLimit);
    done += result.upserted || 0;
    console.log(`  offset=${pos} limit=${batchLimit} upserted=${result.upserted}`);
  }

  console.log(`Total upserted: ${done}`);
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
