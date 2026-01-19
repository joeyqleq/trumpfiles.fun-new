import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: Request) {
  // For transactions, we need to create a fresh connection
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
  }

  const sql = neon(databaseUrl);

  try {
    const data = await request.json()

    // Process entries one by one (serverless doesn't support traditional transactions)
    // For bulk operations, we'll use individual inserts with ON CONFLICT
    for (const entry of data) {
      const { scores, ...mainEntry } = entry
      const { rationale_short, rationale_detail, ...individualScores } = scores

      await sql`
        INSERT INTO trump_entries (entry_number, title, date_start, date_end, synopsis, rationale, category, subcategory, keywords, age, phase, fact_check, fact_check_sources, scores) 
        VALUES (${mainEntry.entry_number}, ${mainEntry.title}, ${mainEntry.date_start}, ${mainEntry.date_end}, ${mainEntry.synopsis}, ${mainEntry.rationale}, ${mainEntry.category}, ${mainEntry.subcategory}, ${mainEntry.keywords}, ${mainEntry.age}, ${mainEntry.phase}, ${mainEntry.fact_check}, ${mainEntry.fact_check_sources}, ${JSON.stringify(scores)}) 
        ON CONFLICT (entry_number) DO NOTHING
      `

      await sql`
        INSERT INTO trump_individual_scores (entry_number, insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope, rationale_short, rationale_detail) 
        VALUES (${mainEntry.entry_number}, ${individualScores.insanity}, ${individualScores.absurdity}, ${individualScores.danger}, ${individualScores.authoritarianism}, ${individualScores.lawlessness}, ${individualScores.credibility_risk}, ${individualScores.recency_intensity}, ${individualScores.impact_scope}, ${rationale_short}, ${rationale_detail}) 
        ON CONFLICT (entry_number) DO NOTHING
      `
    }

    return NextResponse.json({ message: `Successfully processed ${data.length} entries` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ message: 'Failed to upload entries' }, { status: 500 })
  }
}
