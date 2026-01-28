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
  const lastUpdatedValue = updates.last_updated
    ? (updates.last_updated instanceof Date ? updates.last_updated.toISOString() : updates.last_updated)
    : null;

  const result = await sql`
    UPDATE players
    SET 
      name = COALESCE(${updates.name ?? null}, name),
      last_updated = COALESCE(${lastUpdatedValue}, last_updated)
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

  // @vercel/postgres는 배열을 지원하지만 타입 정의가 완전하지 않아 타입 단언 필요
  const result = await sql`
    SELECT * FROM players
    WHERE id = ANY(${ids as any})
    ORDER BY name ASC
  `;
  return result.rows as Player[];
}
