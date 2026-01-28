import { sql } from '@/lib/db';
import { Game, GameWithCompletions } from '@/types';

export async function getAllGames(): Promise<Game[]> {
  const result = await sql`
    SELECT * FROM games
    ORDER BY order_number ASC
  `;
  return result.rows as Game[];
}

export async function getGameById(id: number): Promise<Game | null> {
  const result = await sql`
    SELECT * FROM games
    WHERE id = ${id}
  `;
  return result.rows[0] as Game || null;
}

export async function getGamesWithCompletions(): Promise<GameWithCompletions[]> {
  const result = await sql`
    SELECT 
      g.*,
      json_agg(
        json_build_object(
          'id', gc.id,
          'game_id', gc.game_id,
          'player_id', gc.player_id,
          'status', gc.status,
          'completed_at', gc.completed_at
        )
      ) FILTER (WHERE gc.id IS NOT NULL) as completions
    FROM games g
    LEFT JOIN game_completions gc ON g.id = gc.game_id
    GROUP BY g.id
    ORDER BY g.order_number ASC
  `;

  return result.rows.map(row => ({
    ...row,
    completions: row.completions || []
  })) as GameWithCompletions[];
}

export async function createGame(game: Omit<Game, 'id' | 'created_at' | 'updated_at'>): Promise<Game> {
  const result = await sql`
    INSERT INTO games (order_number, name, min_players, max_players, company, director, series, owned_by)
    VALUES (${game.order_number}, ${game.name}, ${game.min_players}, ${game.max_players}, ${game.company}, ${game.director}, ${game.series}, ${game.owned_by})
    RETURNING *
  `;
  return result.rows[0] as Game;
}

export async function updateGame(id: number, game: Partial<Omit<Game, 'id' | 'created_at' | 'updated_at'>>): Promise<Game> {
  // Vercel Postgres는 tagged template literal만 지원하므로 조건부로 업데이트
  const result = await sql`
    UPDATE games
    SET 
      order_number = COALESCE(${game.order_number ?? null}, order_number),
      name = COALESCE(${game.name ?? null}, name),
      min_players = COALESCE(${game.min_players ?? null}, min_players),
      max_players = ${game.max_players ?? null},
      company = ${game.company ?? null},
      director = ${game.director ?? null},
      series = ${game.series ?? null},
      owned_by = ${game.owned_by ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return result.rows[0] as Game;
}

export async function deleteGame(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM games
    WHERE id = ${id}
  `;
  return result.rowCount > 0;
}

export async function getGamesByPlayerCount(minPlayers: number, maxPlayers?: number): Promise<Game[]> {
  if (maxPlayers) {
    const result = await sql`
      SELECT * FROM games
      WHERE min_players <= ${maxPlayers}
        AND (max_players IS NULL OR max_players >= ${minPlayers})
      ORDER BY order_number ASC
    `;
    return result.rows as Game[];
  } else {
    const result = await sql`
      SELECT * FROM games
      WHERE min_players <= ${minPlayers}
        AND (max_players IS NULL OR max_players >= ${minPlayers})
      ORDER BY order_number ASC
    `;
    return result.rows as Game[];
  }
}
