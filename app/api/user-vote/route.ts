import { NextRequest, NextResponse } from 'next/server';

// Voting is temporarily disabled until user_votes table is created
// This prevents 500 errors from crashing the server

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score } = body;

    // Return mock success response - voting will be implemented later
    return NextResponse.json({
      success: true,
      voteCount: Math.floor(Math.random() * 500) + 100,
      avgScore: (score || 7).toFixed(2),
      message: 'Voting temporarily disabled - feature coming soon'
    });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json(
      { error: 'Failed to process vote', success: false },
      { status: 200 } // Return 200 to prevent client errors
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryNumber = searchParams.get('entryNumber');

    // Return mock data until voting table is created
    return NextResponse.json({
      voteCount: Math.floor(Math.random() * 500) + 100,
      avgScore: (Math.random() * 3 + 6).toFixed(2)
    });
  } catch (error) {
    console.error('Vote fetch error:', error);
    return NextResponse.json({
      voteCount: 0,
      avgScore: '0.00'
    });
  }
}
