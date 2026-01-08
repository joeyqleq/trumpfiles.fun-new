import { type NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/neon';

export async function GET(request: NextRequest, { params }: { params: Promise<{ entry_number: string }> }) {
  const resolvedParams = await params;
  const entryNumber = parseInt(resolvedParams.entry_number as string);

  try {
    // Fetch entry
    const { rows: entryRows } = await pool.query(
      'SELECT * FROM ai_complete_trump_data WHERE entry_number = $1',
      [entryNumber]
    );
    const entry = entryRows[0];

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Fetch approved comments
    const { rows: commentsRows } = await pool.query(
      'SELECT * FROM user_comments WHERE entry_id = $1 AND is_approved = true ORDER BY created_at DESC',
      [entry.id]
    );

    // Fetch aggregated user scores
    const { rows: scoresRows } = await pool.query(
      'SELECT * FROM user_scores WHERE entry_id = $1',
      [entry.id]
    );

    return NextResponse.json({ entry, comments: commentsRows, scores: scoresRows });
  } catch (error) {
    console.error('Error fetching entry data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
