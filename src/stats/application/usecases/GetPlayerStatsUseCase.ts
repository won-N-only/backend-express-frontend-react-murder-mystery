import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";

export interface PlayerStats {
    playerId: string;
    playerName: string;
    completedCount: number;
    totalGames: number;
    completionRate: number;
}

export class GetPlayerStatsUseCase {
    constructor(
        private playerRepository: IPlayerRepository,
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
    ) { }

    async execute(): Promise<PlayerStats[]> {
        const [players, games] = await Promise.all([
            this.playerRepository.findAll(),
            this.gameRepository.findAll(),
        ]);

        const totalGames = games.length || 0;
        if (totalGames === 0 || players.length === 0) return [];

        // DB 레벨에서 집계 (aggregation pipeline 사용으로 성능 최적화)
        const gameIds = games.map((g) => g.id!.toString());
        const playerIds = players.map((p) => p.id!.toString());
        const completionCounts = await this.completionRepository.countByPlayerIds(
            gameIds,
            playerIds,
            CompletionStatus.DONE,
        );

        // 플레이어별 완료 개수 맵 생성
        const completionMap = new Map<string, number>();
        for (const count of completionCounts) {
            completionMap.set(count.playerId, count.count);
        }

        const stats: PlayerStats[] = players.map((player) => {
            const completedCount = completionMap.get(player.id!.toString()) ?? 0;
            const completionRate = totalGames > 0 ? (completedCount / totalGames) * 100 : 0;
            return {
                playerId: player.id!.toString(),
                playerName: player.name,
                completedCount,
                totalGames,
                completionRate: Math.round(completionRate * 100) / 100,
            };
        });

        return stats.sort(
            (a, b) => b.completionRate - a.completionRate || a.playerName.localeCompare(b.playerName),
        );
    }
}
