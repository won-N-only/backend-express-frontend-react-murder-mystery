import type { PlayerStats } from "../../../types/domain";
import { CompletionStatus } from "../../domain/valueObjects/CompletionStatus";
import { MongoDatabase } from "../../infrastructure/database/MongoDatabase";
import { getCompletionRepository, getGameRepository, getPlayerRepository } from "../../infrastructure/di/container";

export interface GameCompletionStat {
    id: string;
    name: string;
    completedCount: number;
    totalPlayers: number;
    completionRate: number;
}

export interface CompanyStat {
    company: string;
    gameCount: number;
}

export class StatsService {
    async getPlayerStats(): Promise<PlayerStats[]> {
        const [playerRepository, gameRepository, completionRepository] = [
            getPlayerRepository(),
            getGameRepository(),
            getCompletionRepository(),
        ];

        const [players, games] = await Promise.all([
            playerRepository.findAll(),
            gameRepository.findAll(),
        ]);

        const totalGames = games.length || 0;
        if (totalGames === 0 || players.length === 0) return [];

        // 완료 상태 조회
        const gameIds = games.map((g) => g.id!.toString());
        const playerIds = players.map((p) => p.id!.toString());
        const completions = await completionRepository.findByGameIdsAndPlayerIds(gameIds, playerIds);

        // 완료된 게임만 필터링
        const completedCompletions = completions.filter((c) => c.status === CompletionStatus.DONE);

        // 플레이어별 완료 개수 집계
        const completionMap = new Map<string, number>();
        for (const completion of completedCompletions) {
            const playerIdStr = completion.playerId.toString();
            completionMap.set(playerIdStr, (completionMap.get(playerIdStr) || 0) + 1);
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

    async getGameCompletionStats(): Promise<GameCompletionStat[]> {
        const playerRepository = getPlayerRepository();
        const gameRepository = getGameRepository();
        const completionRepository = getCompletionRepository();

        const playersCount = (await playerRepository.findAll()).length;
        if (playersCount === 0) return [];

        const games = await gameRepository.findAll();
        const gameIds = games.map((g) => g.id!.toString());
        const playerIds = (await playerRepository.findAll()).map((p) => p.id!.toString());

        // 모든 게임에 대한 완료 상태 조회
        const completions = await completionRepository.findByGameIdsAndPlayerIds(gameIds, playerIds);

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

    async getCompanyStats(): Promise<CompanyStat[]> {
        const db = await MongoDatabase.getDb();
        const pipeline = [
            {
                $match: {
                    company: { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$company",
                    gameCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    company: "$_id",
                    gameCount: 1,
                },
            },
            { $sort: { gameCount: -1 } },
        ];

        return db.collection("games").aggregate(pipeline).toArray();
    }
}
