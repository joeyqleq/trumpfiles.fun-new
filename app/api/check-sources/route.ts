import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entryNumber = searchParams.get('entry');

  try {
    if (entryNumber) {
      // Get sources for a specific entry
      const sources = await sql`
        SELECT * FROM trump_sources WHERE entry_number = ${parseInt(entryNumber)}
      `;
      return NextResponse.json({ entryNumber, sources, count: sources.length });
    }

    // Get all entry numbers that have sources
    const entriesWithSources = await sql`
      SELECT DISTINCT entry_number FROM trump_sources ORDER BY entry_number
    `;

    return NextResponse.json({
      entriesWithSources: entriesWithSources.map(e => e.entry_number),
      totalCount: entriesWithSources.length
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
