import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = parseInt(params.id);
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { player_id, status, completed_at } = body;

    if (!player_id || !status) {
      return NextResponse.json(
        { error: 'player_id and status are required' },
        { status: 400 }
      );
    }

    // 기존 완료 상태 확인 및 업데이트 또는 생성
    const existing = await sql`
      SELECT id FROM game_completions
      WHERE game_id = ${gameId} AND player_id = ${player_id}
    `;

    let result;
    if (existing.rows.length > 0) {
      // 업데이트
      result = await sql`
        UPDATE game_completions
        SET status = ${status}, completed_at = ${completed_at || null}
        WHERE game_id = ${gameId} AND player_id = ${player_id}
        RETURNING *
      `;
    } else {
      // 생성
      result = await sql`
        INSERT INTO game_completions (game_id, player_id, status, completed_at)
        VALUES (${gameId}, ${player_id}, ${status}, ${completed_at || null})
        RETURNING *
      `;
    }

    return NextResponse.json({ completion: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating completion:', error);
    return NextResponse.json(
      { error: 'Failed to update completion' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get('player_id');

    if (!playerId) {
      return NextResponse.json(
        { error: 'player_id is required' },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM game_completions
      WHERE game_id = ${gameId} AND player_id = ${parseInt(playerId)}
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting completion:', error);
    return NextResponse.json(
      { error: 'Failed to delete completion' },
      { status: 500 }
    );
  }
}
