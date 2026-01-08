import { NextResponse } from 'next/server';
import { pool } from '@/lib/neon';

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
    await pool.query(
      'INSERT INTO user_scores (entry_id, danger_score, lawlessness_score, insanity_score, absurdity_score, social_media_score, media_attention_score) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        entry_id,
        danger_score,
        lawlessness_score,
        insanity_score,
        absurdity_score,
        social_media_score,
        media_attention_score,
      ]
    );
    return NextResponse.json({ message: 'Scores submitted successfully' });
  } catch (error) {
    console.error('Error submitting scores:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
