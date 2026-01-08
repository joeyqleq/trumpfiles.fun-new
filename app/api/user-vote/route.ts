import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/neonClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entryNumber, score, userId } = body;

    if (!entryNumber || !score || score < 1 || score > 10) {
      return NextResponse.json(
        { error: 'Invalid vote data' },
        { status: 400 }
      );
    }

    // TODO: Get userId from session/auth when implemented
    const userIdOrIp = userId || request.headers.get('x-forwarded-for') || 'anonymous';

    const sql = neonClient();
    
    // Insert or update vote
    await sql`
      INSERT INTO user_votes (entry_number, user_id, score, voted_at)
      VALUES (${entryNumber}, ${userIdOrIp}, ${score}, NOW())
      ON CONFLICT (entry_number, user_id)
      DO UPDATE SET score = ${score}, voted_at = NOW()
    `;

    // Get updated vote count
    const [voteStats] = await sql`
      SELECT 
        COUNT(*) as vote_count,
        AVG(score) as avg_score
      FROM user_votes
      WHERE entry_number = ${entryNumber}
    `;

    return NextResponse.json({
      success: true,
      voteCount: voteStats.vote_count,
      avgScore: parseFloat(voteStats.avg_score).toFixed(2)
    });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryNumber = searchParams.get('entryNumber');

    if (!entryNumber) {
      return NextResponse.json(
        { error: 'Entry number required' },
        { status: 400 }
      );
    }

    const sql = neonClient();
    
    const [voteStats] = await sql`
      SELECT 
        COUNT(*) as vote_count,
        AVG(score) as avg_score
      FROM user_votes
      WHERE entry_number = ${entryNumber}
    `;

    return NextResponse.json({
      voteCount: voteStats?.vote_count || 0,
      avgScore: voteStats?.avg_score ? parseFloat(voteStats.avg_score).toFixed(2) : '0.00'
    });
  } catch (error) {
    console.error('Vote fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
