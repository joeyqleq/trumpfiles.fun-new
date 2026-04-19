import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const {
    entry_id,
    danger_score,
    lawlessness_score,
    insanity_score,
    absurdity_score,
    social_media_score,
    media_attention_score,
  } = await request.json();

  try {
    await sql`INSERT INTO user_scores (entry_id, danger_score, lawlessness_score, insanity_score, absurdity_score, social_media_score, media_attention_score) VALUES (${entry_id}, ${danger_score}, ${lawlessness_score}, ${insanity_score}, ${absurdity_score}, ${social_media_score}, ${media_attention_score})`;
    return NextResponse.json({ message: 'Scores submitted successfully' });
  } catch (error) {
    console.error('Error submitting scores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
