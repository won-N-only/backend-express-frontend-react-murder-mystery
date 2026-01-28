import { findMatchingGames } from '@/lib/utils/matching';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_ids, player_count } = body;

    if (!player_ids || !Array.isArray(player_ids) || player_ids.length === 0) {
      return NextResponse.json(
        { error: 'player_ids array is required' },
        { status: 400 }
      );
    }

    if (!player_count || player_count < 2) {
      return NextResponse.json(
        { error: 'player_count must be at least 2' },
        { status: 400 }
      );
    }

    const matches = await findMatchingGames({
      playerIds: player_ids,
      playerCount: player_count
    });

    return NextResponse.json({ matches }, { status: 200 });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Failed to find matching games' },
      { status: 500 }
    );
  }
}
