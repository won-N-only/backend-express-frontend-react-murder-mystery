import { sql } from '@/lib/db';
import { Player } from '@/types';

export async function getAllPlayers(): Promise<Player[]> {
  const result = await sql`
    SELECT * FROM players
    ORDER BY name ASC
  `;
  return result.rows as Player[];
}

export async function getPlayerById(id: number): Promise<Player | null> {
  const result = await sql`
    SELECT * FROM players
    WHERE id = ${id}
  `;
  return result.rows[0] as Player || null;
}

export async function getPlayerByName(name: string): Promise<Player | null> {
  const result = await sql`
    SELECT * FROM players
    WHERE name = ${name}
  `;
  return result.rows[0] as Player || null;
}

export async function createPlayer(name: string): Promise<Player> {
  const result = await sql`
    INSERT INTO players (name)
    VALUES (${name})
    RETURNING *
  `;
  return result.rows[0] as Player;
}

export async function updatePlayer(id: number, updates: Partial<Omit<Player, 'id' | 'created_at'>>): Promise<Player> {
  const result = await sql`
    UPDATE players
    SET 
      name = COALESCE(${updates.name ?? null}, name),
      last_updated = COALESCE(${updates.last_updated ?? null}, last_updated)
    WHERE id = ${id}
    RETURNING *
  `;

  return result.rows[0] as Player;
}

export async function deletePlayer(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM players
    WHERE id = ${id}
  `;
  return result.rowCount > 0;
}

export async function getPlayersByIds(ids: number[]): Promise<Player[]> {
  if (ids.length === 0) return [];

  const result = await sql`
    SELECT * FROM players
    WHERE id = ANY(${ids})
    ORDER BY name ASC
  `;
  return result.rows as Player[];
}
