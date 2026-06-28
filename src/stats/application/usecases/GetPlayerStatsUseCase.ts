import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";
import type { IStatSnapshotRepository } from "@stats/domain/repositories/IStatSnapshotRepository";

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
        private statSnapshotRepository: IStatSnapshotRepository,
    ) {}

    async execute(): Promise<PlayerStats[]> {
        const [players, games] = await Promise.all([
            this.playerRepository.findAll(),
            this.gameRepository.findAll(),
        ]);

        const totalGames = games.length;
        if (totalGames === 0 || players.length === 0) return [];

        const playerIds = players.map((p) => p.id!.toString());
        const completionMap = await this.statSnapshotRepository.getPlayerCounts(playerIds);

        const stats: PlayerStats[] = players.map((player) => {
            const completedCount = completionMap.get(player.id!.toString()) ?? 0;
            const completionRate =
                totalGames > 0 ? Math.round((completedCount / totalGames) * 10000) / 100 : 0;
            return {
                playerId: player.id!.toString(),
                playerName: player.name,
                completedCount,
                totalGames,
                completionRate,
            };
        });

        return stats.sort(
            (a, b) => b.completionRate - a.completionRate || a.playerName.localeCompare(b.playerName),
        );
    }
}
