import { createPlayer, getAllPlayers } from '@/lib/queries/players';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const players = await getAllPlayers();
    return NextResponse.json({ players }, { status: 200 });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const player = await createPlayer(name);
    return NextResponse.json({ player }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating player:', error);
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'Player with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
