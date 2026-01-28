import { createGame, getAllGames, getGamesByPlayerCount } from '@/lib/queries/games';
import { Game } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const minPlayers = searchParams.get('min_players');
    const maxPlayers = searchParams.get('max_players');
    const company = searchParams.get('company');
    const series = searchParams.get('series');

    let games: Game[];

    if (minPlayers) {
      const min = parseInt(minPlayers);
      const max = maxPlayers ? parseInt(maxPlayers) : undefined;
      games = await getGamesByPlayerCount(min, max);
    } else {
      games = await getAllGames();
    }

    // 필터링
    if (company) {
      games = games.filter(game => game.company === company);
    }
    if (series) {
      games = games.filter(game => game.series === series);
    }

    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_number,
      name,
      min_players,
      max_players,
      company,
      director,
      series,
      owned_by
    } = body;

    if (!name || !min_players) {
      return NextResponse.json(
        { error: 'Name and min_players are required' },
        { status: 400 }
      );
    }

    const game = await createGame({
      order_number: order_number || 0,
      name,
      min_players,
      max_players: max_players || null,
      company: company || null,
      director: director || null,
      series: series || null,
      owned_by: owned_by || null
    });

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
