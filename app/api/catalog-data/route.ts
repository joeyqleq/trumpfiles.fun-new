import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function GET() {
  try {
    // Get entries with their sources aggregated
    const rows = await sql`
      SELECT 
        ranked.*,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'url', ts.url,
              'title', ts.title,
              'publisher', ts.publisher,
              'source_type', ts.source_type
            ))
            FROM trump_sources ts 
            WHERE ts.entry_number = ranked.entry_number
          ),
          '[]'::json
        ) as sources
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
