import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";

export interface GameCompletionStat {
    id: string;
    name: string;
    completedCount: number;
    totalPlayers: number;
    completionRate: number;
}

export class GetGameCompletionStatsUseCase {
    constructor(
        private playerRepository: IPlayerRepository,
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
    ) { }

    async execute(): Promise<GameCompletionStat[]> {
        // 플레이어와 게임을 병렬로 조회
        const [players, games] = await Promise.all([
            this.playerRepository.findAll(),
            this.gameRepository.findAll(),
        ]);

        const playersCount = players.length;
        if (playersCount === 0 || games.length === 0) return [];

        const gameIds = games.map((g) => g.id!.toString());
        const playerIds = players.map((p) => p.id!.toString());

        // DB 레벨에서 집계 (aggregation pipeline 사용으로 성능 최적화)
        const completionCounts = await this.completionRepository.countByGameIds(
            gameIds,
            playerIds,
            CompletionStatus.DONE,
        );

        // 게임별 완료 개수 맵 생성
        const gameCompletionMap = new Map<string, number>();
        for (const count of completionCounts) {
            gameCompletionMap.set(count.gameId, count.count);
        }

        const stats: GameCompletionStat[] = games.map((game) => {
            const completedCount = gameCompletionMap.get(game.id!.toString()) || 0;
            const completionRate =
                playersCount > 0 ? Math.round(((completedCount / playersCount) * 100) * 10) / 10 : 0;
            return {
                id: game.id!.toString(),
                name: game.name,
                completedCount,
                totalPlayers: playersCount,
                completionRate,
            };
        });

        return stats.sort((a, b) => a.completionRate - b.completionRate);
    }
}
