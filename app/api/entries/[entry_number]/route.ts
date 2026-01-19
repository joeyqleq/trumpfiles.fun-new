import { type NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function GET(request: NextRequest, { params }: { params: Promise<{ entry_number: string }> }) {
  const resolvedParams = await params;
  const entryNumber = parseInt(resolvedParams.entry_number as string);

  try {
    // Fetch entry
    const entryRows = await sql`SELECT * FROM ai_complete_trump_data WHERE entry_number = ${entryNumber}`;
    const entry = entryRows[0];

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Fetch approved comments
    const commentsRows = await sql`SELECT * FROM user_comments WHERE entry_id = ${entry.id} AND is_approved = true ORDER BY created_at DESC`;

    // Fetch aggregated user scores
    const scoresRows = await sql`SELECT * FROM user_scores WHERE entry_id = ${entry.id}`;

    return NextResponse.json({ entry, comments: commentsRows, scores: scoresRows });
  } catch (error) {
    console.error('Error fetching entry data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
