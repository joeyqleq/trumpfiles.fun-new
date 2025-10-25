
import { NextResponse } from 'next/server'
import { pool } from '@/lib/neon'

export async function GET() {
  try {
    const { rows: entriesData } = await pool.query('SELECT * FROM ai_complete_trump_data ORDER BY created_at DESC LIMIT 100')
    
    const { rows: statsData } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM trump_entries) as total_entries,
        (SELECT COUNT(*) FROM trump_user_comments) as total_comments,
        (SELECT COUNT(*) FROM trump_user_scores) as total_scores,
        (SELECT AVG(danger) FROM trump_individual_scores) as avg_danger
    `)

    return NextResponse.json({
      entries: entriesData || [],
      stats: {
        totalEntries: statsData[0].total_entries || 0,
        totalComments: statsData[0].total_comments || 0,
        totalScores: statsData[0].total_scores || 0,
        avgDanger: parseFloat(statsData[0].avg_danger || 0).toFixed(1),
      }
    })
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
