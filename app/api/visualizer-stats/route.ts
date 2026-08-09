import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function GET() {
  try {
    const [totals] = await sql`
      SELECT
        COUNT(*) as total_entries,
        AVG(danger) as avg_danger,
        AVG(absurdity) as avg_absurdity,
        AVG(lawlessness) as avg_lawlessness,
        AVG(insanity) as avg_insanity,
        AVG(authoritarianism) as avg_authoritarianism,
        MAX(danger) as peak_danger,
        MIN(date_start) as earliest_date,
        MAX(date_start) as latest_date
      FROM ai_complete_trump_data
    `;

    const categories = await sql`
      SELECT category, COUNT(*) as count,
        AVG(danger) as avg_danger,
        AVG(absurdity) as avg_absurdity
      FROM ai_complete_trump_data
      GROUP BY category
      ORDER BY count DESC
    `;

    const timeline = await sql`
      SELECT
        EXTRACT(YEAR FROM date_start::date) as year,
        COUNT(*) as count,
        AVG(danger) as avg_danger,
        AVG(absurdity) as avg_absurdity
      FROM ai_complete_trump_data
      WHERE date_start IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM date_start::date)
      ORDER BY year
    `;

    const phases = await sql`
      SELECT phase, COUNT(*) as count,
        AVG(danger) as avg_danger,
        AVG(absurdity) as avg_absurdity
      FROM ai_complete_trump_data
      GROUP BY phase
      ORDER BY count DESC
    `;

    const topKeywords = await sql`
      SELECT kw, COUNT(*) as count
      FROM ai_complete_trump_data, UNNEST(all_keywords) AS kw
      WHERE kw IS NOT NULL AND LENGTH(kw) > 2
      GROUP BY kw
      ORDER BY count DESC
      LIMIT 30
    `;

    return NextResponse.json({
      totals: {
        total_entries: parseInt(totals.total_entries),
        avg_danger: parseFloat(parseFloat(totals.avg_danger).toFixed(2)),
        avg_absurdity: parseFloat(parseFloat(totals.avg_absurdity).toFixed(2)),
        avg_lawlessness: parseFloat(parseFloat(totals.avg_lawlessness).toFixed(2)),
        avg_insanity: parseFloat(parseFloat(totals.avg_insanity).toFixed(2)),
        avg_authoritarianism: parseFloat(parseFloat(totals.avg_authoritarianism).toFixed(2)),
        peak_danger: parseFloat(parseFloat(totals.peak_danger).toFixed(1)),
        earliest_date: totals.earliest_date,
        latest_date: totals.latest_date,
      },
      categories,
      timeline,
      phases,
      topKeywords,
    });
  } catch (error) {
    console.error('Error fetching visualizer stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
