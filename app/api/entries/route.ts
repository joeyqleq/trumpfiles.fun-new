import { NextResponse } from 'next/server';
import { pool } from '@/lib/neon';

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM ai_complete_trump_data ORDER BY fucked_up_rank ASC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
