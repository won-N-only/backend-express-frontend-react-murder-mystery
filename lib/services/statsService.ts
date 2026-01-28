import { ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import type { PlayerStats } from "../../types/domain";
import { CompletionStatus } from "../../types/domain";

export async function getPlayerStats(): Promise<PlayerStats[]> {
    const db = await getDb();

    const pipeline = [
        {
            $lookup: {
                from: "games",
                localField: "_id",
                foreignField: "_id", // dummy join, we will use $lookup in next stage
                as: "dummy",
            },
        },
    ];

    // 더 단순하게: players와 games의 개수를 따로 구한 뒤 completions로 집계
    const [players, games] = await Promise.all([
        db.collection("players").find({}).toArray(),
        db.collection("games").find({}).project({ _id: 1 }).toArray(),
    ]);

    const totalGames = games.length || 0;
    if (totalGames === 0 || players.length === 0) return [];

    const completions = await db
        .collection("gameCompletions")
        .aggregate([
            { $match: { status: CompletionStatus.DONE } },
            {
                $group: {
                    _id: "$playerId",
                    completedCount: { $sum: 1 },
                },
            },
        ])
        .toArray();

    const completionMap = new Map<string, number>(
        completions.map((c) => [c._id.toString(), c.completedCount as number]),
    );

    const stats: PlayerStats[] = players.map((p: any) => {
        const completedCount = completionMap.get(p._id.toString()) ?? 0;
        const completionRate = totalGames > 0 ? (completedCount / totalGames) * 100 : 0;
        return {
            playerId: p._id.toString(),
            playerName: p.name as string,
            completedCount,
            totalGames,
            completionRate: Math.round(completionRate * 100) / 100,
        };
    });

    return stats.sort((a, b) => b.completionRate - a.completionRate || a.playerName.localeCompare(b.playerName));
}

export async function getGameCompletionStats() {
    const db = await getDb();

    const playersCount = await db.collection("players").countDocuments();
    if (playersCount === 0) return [];

    const pipeline = [
        {
            $lookup: {
                from: "gameCompletions",
                localField: "_id",
                foreignField: "gameId",
                as: "completions",
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                completedCount: {
                    $size: {
                        $filter: {
                            input: "$completions",
                            as: "c",
                            cond: { $eq: ["$$c.status", CompletionStatus.DONE] },
                        },
                    },
                },
            },
        },
    ];

    const games = await db.collection("games").aggregate(pipeline).toArray();

    return games
        .map((g: any) => {
            const completionRate =
                playersCount > 0 ? Math.round(((g.completedCount || 0) / playersCount) * 100 * 10) / 10 : 0;
            return {
                id: g._id.toString(),
                name: g.name as string,
                completedCount: g.completedCount || 0,
                totalPlayers: playersCount,
                completionRate,
            };
        })
        .sort((a, b) => a.completionRate - b.completionRate);
}

export async function getCompanyStats() {
    const db = await getDb();
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

