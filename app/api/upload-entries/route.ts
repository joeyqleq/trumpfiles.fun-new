
import { NextResponse } from 'next/server'
import { pool } from '@/lib/neon'

export async function POST(request: Request) {
  const client = await pool.connect()
  try {
    const data = await request.json()
    
    await client.query('BEGIN')
    for (const entry of data) {
      const { id, scores, ...mainEntry } = entry
      const { rationale_short, rationale_detail, ...individualScores } = scores

      const mainEntryValues = Object.values(mainEntry)
      // Ensure all values are present, providing defaults for any missing ones
      const allValues = [...mainEntryValues, JSON.stringify(scores)];

      await client.query(
        `INSERT INTO trump_entries (entry_number, title, date_start, date_end, synopsis, rationale, category, subcategory, keywords, age, phase, fact_check, fact_check_sources, scores) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
         ON CONFLICT (entry_number) DO NOTHING`,
        allValues
      )

      const individualScoresValues = [mainEntry.entry_number, ...Object.values(individualScores), rationale_short, rationale_detail];
      await client.query(
        `INSERT INTO trump_individual_scores (entry_number, insanity, absurdity, danger, authoritarianism, lawlessness, credibility_risk, recency_intensity, impact_scope, rationale_short, rationale_detail) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         ON CONFLICT (entry_number) DO NOTHING`,
        individualScoresValues
      )
    }
    await client.query('COMMIT')
    
    return NextResponse.json({ message: `Successfully processed ${data.length} entries` })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Upload error:', error)
    return NextResponse.json({ message: 'Failed to upload entries' }, { status: 500 })
  } finally {
    client.release()
  }
}
