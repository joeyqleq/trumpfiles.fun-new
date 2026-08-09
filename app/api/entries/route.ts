import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Auth check — allow internal CF worker ingest calls
    const authHeader = request.headers.get('authorization');
    const ingestSecret = process.env.INGESTION_SECRET;
    if (ingestSecret && authHeader !== `Bearer ${ingestSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 500);

    const rows = await sql`
      SELECT entry_number, title, synopsis, category, phase,
             danger, authoritarianism, lawlessness, insanity, absurdity, date_start
      FROM ai_complete_trump_data
      ORDER BY entry_number ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return NextResponse.json({ entries: rows });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
