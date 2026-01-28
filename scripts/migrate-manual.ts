/**
 * 수동 데이터 입력을 위한 헬퍼 스크립트
 * Google Sheets 데이터를 JSON 형식으로 변환한 후 사용
 */

import { sql } from '@vercel/postgres';

interface GameData {
  order_number: number;
  name: string;
  min_players: number;
  max_players: number | null;
  company: string | null;
  director: string | null;
  series: string | null;
  owned_by: string | null;
  completions: Record<string, '완료' | 'X' | '예정' | '에러플💦'>;
}

async function insertGameData(gameData: GameData, playerMap: Map<string, number>) {
  try {
    // 게임 생성
    const gameResult = await sql`
      INSERT INTO games (order_number, name, min_players, max_players, company, director, series, owned_by)
      VALUES (
        ${gameData.order_number},
        ${gameData.name},
        ${gameData.min_players},
        ${gameData.max_players},
        ${gameData.company},
        ${gameData.director},
        ${gameData.series},
        ${gameData.owned_by}
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `;

    if (gameResult.rows.length === 0) {
      // 이미 존재하는 경우 ID 조회
      const existing = await sql`
        SELECT id FROM games WHERE name = ${gameData.name}
      `;
      if (existing.rows.length === 0) {
        console.error(`게임을 찾을 수 없습니다: ${gameData.name}`);
        return;
      }
      gameResult.rows[0] = existing.rows[0];
    }

    const gameId = gameResult.rows[0].id;

    // 완료 상태 입력
    for (const [playerName, status] of Object.entries(gameData.completions)) {
      const playerId = playerMap.get(playerName);
      if (!playerId) {
        console.warn(`참가자를 찾을 수 없습니다: ${playerName}`);
        continue;
      }

      await sql`
        INSERT INTO game_completions (game_id, player_id, status)
        VALUES (${gameId}, ${playerId}, ${status})
        ON CONFLICT (game_id, player_id) 
        DO UPDATE SET status = EXCLUDED.status
      `;
    }

    console.log(`✓ ${gameData.name} (ID: ${gameId})`);
  } catch (error) {
    console.error(`✗ ${gameData.name} 실패:`, error);
  }
}

async function getPlayerMap(): Promise<Map<string, number>> {
  const players = await sql`SELECT id, name FROM players`;
  const map = new Map<string, number>();
  for (const player of players.rows) {
    map.set(player.name, player.id);
  }
  return map;
}

export async function migrateGamesFromJSON(gamesData: GameData[]) {
  const playerMap = await getPlayerMap();

  console.log(`총 ${gamesData.length}개의 게임 데이터 입력 시작...\n`);

  for (const gameData of gamesData) {
    await insertGameData(gameData, playerMap);
  }

  console.log('\n마이그레이션 완료!');
}

// 사용 예시:
// const gamesData: GameData[] = [
//   {
//     order_number: 1,
//     name: "MMM 시리즈 : 시체와 온천",
//     min_players: 4,
//     max_players: 5,
//     company: "언더독 게임즈",
//     director: "감독",
//     series: "MMM 시리즈",
//     owned_by: null,
//     completions: {
//       "감독": "완료",
//       "연두": "완료",
//       // ...
//     }
//   },
//   // ...
// ];
// migrateGamesFromJSON(gamesData);
