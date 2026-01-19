import { NextResponse } from 'next/server';
import { sql } from '@/lib/neonClient';

export async function POST(request: Request) {
  const { entry_id, user_name, user_email, comment_text } = await request.json();

  try {
    await sql`INSERT INTO user_comments (entry_id, user_name, user_email, comment_text, is_approved) VALUES (${entry_id}, ${user_name}, ${user_email}, ${comment_text}, false)`;
    return NextResponse.json({ message: 'Comment submitted for review' });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
