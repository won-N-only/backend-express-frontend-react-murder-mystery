import { sql } from '@/lib/db';
import { Game, MatchResult } from '@/types';

export interface MatchingOptions {
  playerIds: number[];
  playerCount: number;
}

export async function findMatchingGames(options: MatchingOptions): Promise<MatchResult[]> {
  const { playerIds, playerCount } = options;

  // 인원 수에 맞는 게임 조회
  const games = await sql`
    SELECT g.*
    FROM games g
    WHERE g.min_players <= ${playerCount}
      AND (g.max_players IS NULL OR g.max_players >= ${playerCount})
    ORDER BY g.order_number ASC
  `;

  const results: MatchResult[] = [];

  for (const game of games.rows as Game[]) {
    // 각 참가자의 완료 상태 확인
    const completions = await sql`
      SELECT gc.player_id, gc.status, p.name
      FROM game_completions gc
      JOIN players p ON gc.player_id = p.id
      WHERE gc.game_id = ${game.id}
        AND gc.player_id = ANY(${playerIds})
    `;

    const playerStatusMap = new Map(
      completions.rows.map(row => [row.player_id, row.status])
    );

    // 미완료한 참가자 목록
    const incompletePlayers: string[] = [];
    let completedCount = 0;
    let totalChecked = 0;

    for (const playerId of playerIds) {
      const status = playerStatusMap.get(playerId);
      if (!status || status === 'X') {
        // 참가자 이름 가져오기
        const playerName = completions.rows.find(r => r.player_id === playerId)?.name;
        if (playerName) {
          incompletePlayers.push(playerName);
        }
        totalChecked++;
      } else if (status === '완료') {
        completedCount++;
        totalChecked++;
      }
    }

    // 매칭 점수 계산
    // - 모든 참가자가 미완료: 높은 점수
    // - 완료율이 낮을수록 높은 점수
    const completionRate = totalChecked > 0 ? completedCount / totalChecked : 0;
    const matchScore = (1 - completionRate) * 100 + (incompletePlayers.length === playerIds.length ? 50 : 0);

    results.push({
      ...game,
      match_score: matchScore,
      incomplete_players: incompletePlayers
    });
  }

  // 매칭 점수 순으로 정렬
  return results.sort((a, b) => b.match_score - a.match_score);
}
