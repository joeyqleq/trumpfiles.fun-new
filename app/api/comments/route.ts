import { NextResponse } from 'next/server';
import { pool } from '@/lib/neon';

export async function POST(request: Request) {
  const { entry_id, user_name, user_email, comment_text } = await request.json();

  try {
    await pool.query(
      'INSERT INTO user_comments (entry_id, user_name, user_email, comment_text, is_approved) VALUES ($1, $2, $3, $4, false)',
      [entry_id, user_name, user_email, comment_text]
    );
    return NextResponse.json({ message: 'Comment submitted for review' });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
