import { sql } from '@/lib/db';
import { PlayerStats } from '@/types';

export async function getPlayerStats(): Promise<PlayerStats[]> {
  const result = await sql`
    SELECT 
      p.id as player_id,
      p.name as player_name,
      COUNT(CASE WHEN gc.status = '완료' THEN 1 END) as completed_count,
      COUNT(DISTINCT g.id) as total_games,
      ROUND(
        COUNT(CASE WHEN gc.status = '완료' THEN 1 END)::numeric / 
        NULLIF(COUNT(DISTINCT g.id), 0) * 100, 
        2
      ) as completion_rate
    FROM players p
    CROSS JOIN games g
    LEFT JOIN game_completions gc ON g.id = gc.game_id AND p.id = gc.player_id
    GROUP BY p.id, p.name
    ORDER BY completion_rate DESC, p.name ASC
  `;

  return result.rows.map(row => ({
    player_id: row.player_id,
    player_name: row.player_name,
    completed_count: parseInt(row.completed_count) || 0,
    total_games: parseInt(row.total_games) || 0,
    completion_rate: parseFloat(row.completion_rate) || 0
  })) as PlayerStats[];
}

export async function getGameCompletionStats() {
  const result = await sql`
    SELECT 
      g.id,
      g.name,
      COUNT(CASE WHEN gc.status = '완료' THEN 1 END) as completed_count,
      COUNT(DISTINCT p.id) as total_players,
      ROUND(
        COUNT(CASE WHEN gc.status = '완료' THEN 1 END)::numeric / 
        NULLIF(COUNT(DISTINCT p.id), 0) * 100, 
        2
      ) as completion_rate
    FROM games g
    CROSS JOIN players p
    LEFT JOIN game_completions gc ON g.id = gc.game_id AND p.id = gc.player_id
    GROUP BY g.id, g.name
    ORDER BY completion_rate ASC, g.order_number ASC
  `;

  return result.rows;
}

export async function getCompanyStats() {
  const result = await sql`
    SELECT 
      company,
      COUNT(*) as game_count,
      COUNT(CASE WHEN gc.status = '완료' THEN 1 END) as total_completions
    FROM games g
    LEFT JOIN game_completions gc ON g.id = gc.game_id
    WHERE company IS NOT NULL
    GROUP BY company
    ORDER BY game_count DESC
  `;

  return result.rows;
}

export async function getSeriesStats() {
  const result = await sql`
    SELECT 
      series,
      COUNT(*) as game_count,
      COUNT(CASE WHEN gc.status = '완료' THEN 1 END) as total_completions
    FROM games g
    LEFT JOIN game_completions gc ON g.id = gc.game_id
    WHERE series IS NOT NULL
    GROUP BY series
    ORDER BY game_count DESC
  `;

  return result.rows;
}
