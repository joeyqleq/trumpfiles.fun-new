import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';
import { derivePhaseGroup, type VisualizerLabRow } from '@/lib/visualizer-lab/types';
import type { AICompleteTrumpData } from '@/types/database';

interface VisualizerLabQueryRow extends AICompleteTrumpData {
  archive_created_at: string | null;
  archive_order: number | string;
}

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        ai.*,
        te.created_at AS archive_created_at,
        ROW_NUMBER() OVER (
          ORDER BY te.created_at DESC NULLS LAST, ai.entry_number DESC
        ) AS archive_order
      FROM ai_complete_trump_data ai
      LEFT JOIN trump_entries te
        ON te.entry_number = ai.entry_number
      ORDER BY te.created_at DESC NULLS LAST, ai.entry_number DESC
    ` as unknown as VisualizerLabQueryRow[];

    const labRows: VisualizerLabRow[] = rows.map((row) => ({
      ...row,
      archive_created_at: row.archive_created_at,
      archive_order: Number(row.archive_order),
      phase_group: derivePhaseGroup(row.phase, row.date_start),
    }));

    return NextResponse.json(labRows);
  } catch (error) {
    console.error('Error fetching visualizer lab entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
