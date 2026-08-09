import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.INGESTION_SECRET;

  if (!expectedToken) {
    return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
  }

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
  }

  const idempotencyKey = request.headers.get('x-idempotency-key');
  const sql = neon(databaseUrl);

  try {
    const data = await request.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ message: 'Body must be a non-empty array' }, { status: 400 });
    }

    if (data.length > 200) {
      return NextResponse.json({ message: 'Batch too large (max 200)' }, { status: 400 });
    }

    if (idempotencyKey) {
      const existing = await sql`
        SELECT id FROM ingestion_runs WHERE idempotency_key = ${idempotencyKey}
      `;
      if (existing.length > 0) {
        return NextResponse.json({
          message: 'Duplicate request (idempotency key already processed)',
          run_id: existing[0].id
        }, { status: 200 });
      }
    }

    const runResult = await sql`
      INSERT INTO ingestion_runs (idempotency_key, entry_count, status)
      VALUES (${idempotencyKey || null}, ${data.length}, 'running')
      RETURNING id
    `;
    const runId = runResult[0].id;

    let inserted = 0;
    let skipped = 0;
    const errors: { entry_number: number; error: string }[] = [];

    for (const entry of data) {
      try {
        const { scores, ...mainEntry } = entry;
        const { rationale_short, rationale_detail, ...individualScores } = scores || {};

        const entryResult = await sql`
          INSERT INTO trump_entries (entry_number, title, date_start, date_end, synopsis, rationale, category, subcategory, keywords, age, phase, fact_check, fact_check_sources, scores)
          VALUES (${mainEntry.entry_number}, ${mainEntry.title}, ${mainEntry.date_start || null}, ${mainEntry.date_end || null}, ${mainEntry.synopsis}, ${mainEntry.rationale || null}, ${mainEntry.category}, ${mainEntry.subcategory || null}, ${mainEntry.keywords || []}, ${mainEntry.age || null}, ${mainEntry.phase || null}, ${mainEntry.fact_check || null}, ${mainEntry.fact_check_sources || null}, ${JSON.stringify(scores || {})})
          ON CONFLICT (entry_number) DO NOTHING
          RETURNING entry_number
        `;

        if (entryResult.length > 0 && scores) {
          await sql`
            INSERT INTO trump_individual_scores (entry_number, insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope, rationale_short, rationale_detail)
            VALUES (${mainEntry.entry_number}, ${individualScores.insanity || 0}, ${individualScores.absurdity || 0}, ${individualScores.danger || 0}, ${individualScores.authoritarianism || 0}, ${individualScores.lawlessness || 0}, ${individualScores.credibility_risk || 0}, ${individualScores.recency_intensity || 0}, ${individualScores.impact_scope || 0}, ${rationale_short || null}, ${rationale_detail || null})
            ON CONFLICT (entry_number) DO UPDATE SET
              insanity = EXCLUDED.insanity,
              absurdity = EXCLUDED.absurdity,
              danger = EXCLUDED.danger,
              authoritarianism = EXCLUDED.authoritarianism,
              lawlessness = EXCLUDED.lawlessness,
              credibility_risk = EXCLUDED.credibility_risk,
              recency_intensity = EXCLUDED.recency_intensity,
              impact_scope = EXCLUDED.impact_scope,
              rationale_short = EXCLUDED.rationale_short,
              rationale_detail = EXCLUDED.rationale_detail
          `;
          inserted++;
        } else {
          skipped++;
        }
      } catch (entryError) {
        errors.push({
          entry_number: entry.entry_number || 0,
          error: entryError instanceof Error ? entryError.message : 'Unknown error'
        });
      }
    }

    const finalStatus = errors.length === 0 ? 'completed' : (inserted > 0 ? 'partial' : 'failed');
    await sql`
      UPDATE ingestion_runs
      SET status = ${finalStatus}, inserted_count = ${inserted}, skipped_count = ${skipped}, error_count = ${errors.length}, completed_at = NOW()
      WHERE id = ${runId}
    `;

    return NextResponse.json({
      message: `Processed ${data.length} entries`,
      run_id: runId,
      inserted,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Failed to upload entries' }, { status: 500 });
  }
}
