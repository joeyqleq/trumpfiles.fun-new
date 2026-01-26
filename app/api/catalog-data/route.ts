import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function GET() {
  try {
    const rows = await sql`
      SELECT *
      FROM (
        SELECT *,
          row_number() OVER (
            PARTITION BY category
            ORDER BY fucked_up_score ASC NULLS LAST, entry_number ASC
          ) AS category_rank
        FROM ai_complete_trump_data
      ) ranked
      ORDER BY
        category_rank ASC,
        md5(coalesce(category, '') || 'catalog_v1') ASC,
        md5(entry_number::text || 'catalog_v1') ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching catalog entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
