import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function GET() {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const limit = isDev ? 100 : 10000;
    const rows = await sql`SELECT * FROM ai_complete_trump_data ORDER BY date_start ASC NULLS LAST LIMIT ${limit}`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
