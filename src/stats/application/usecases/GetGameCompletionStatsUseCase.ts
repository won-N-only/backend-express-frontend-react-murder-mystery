import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";
import type { IStatSnapshotRepository } from "@stats/application/ports/IStatSnapshotRepository";

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
        private statSnapshotRepository: IStatSnapshotRepository,
    ) {}

    async execute(): Promise<GameCompletionStat[]> {
        const [players, games] = await Promise.all([
            this.playerRepository.findAll(),
            this.gameRepository.findAll(),
        ]);

        const totalPlayers = players.length;
        if (totalPlayers === 0 || games.length === 0) return [];

        const gameIds = games.map((g) => g.id!.toString());
        const completionMap = await this.statSnapshotRepository.getGameCounts(gameIds);

        const stats: GameCompletionStat[] = games.map((game) => {
            const completedCount = completionMap.get(game.id!.toString()) ?? 0;
            const completionRate =
                totalPlayers > 0 ? Math.round((completedCount / totalPlayers) * 1000) / 10 : 0;
            return {
                id: game.id!.toString(),
                name: game.name,
                completedCount,
                totalPlayers,
                completionRate,
            };
        });

        return stats.sort((a, b) => a.completionRate - b.completionRate);
    }
}
