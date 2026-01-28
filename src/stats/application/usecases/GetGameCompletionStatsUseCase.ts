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

        // 모든 게임에 대한 완료 상태 조회
        const completions = await this.completionRepository.findByGameIdsAndPlayerIds(gameIds, playerIds);

        // 게임별 완료 개수 집계
        const gameCompletionMap = new Map<string, number>();
        for (const completion of completions) {
            if (completion.status === CompletionStatus.DONE) {
                const gameIdStr = completion.gameId.toString();
                gameCompletionMap.set(gameIdStr, (gameCompletionMap.get(gameIdStr) || 0) + 1);
            }
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
