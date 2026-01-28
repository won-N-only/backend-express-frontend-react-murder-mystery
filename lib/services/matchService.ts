import { ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import type { MatchResult, Game } from "../../types/domain";
import { CompletionStatus } from "../../types/domain";

interface FindMatchesOptions {
    playerIds: string[]; // ObjectId 문자열
    playerCount: number;
}

export async function findMatches({ playerIds, playerCount }: FindMatchesOptions): Promise<MatchResult[]> {
    const db = await getDb();
    const playersObjectIds = playerIds.map((id) => new ObjectId(id));

    // 인원 수 조건에 맞는 게임들
    const games = await db
        .collection<Game>("games")
        .find({
            minPlayers: { $lte: playerCount },
            $or: [{ maxPlayers: null }, { maxPlayers: { $gte: playerCount } }],
        })
        .sort({ orderNumber: 1 })
        .toArray();

    if (games.length === 0) return [];

    // 해당 게임 + 플레이어에 대한 완료 상태를 한 번에 조회
    const gameIds = games.map((g) => g._id!) as ObjectId[];
    const completions = await db
        .collection("gameCompletions")
        .aggregate([
            { $match: { gameId: { $in: gameIds }, playerId: { $in: playersObjectIds } } },
            {
                $lookup: {
                    from: "players",
                    localField: "playerId",
                    foreignField: "_id",
                    as: "player",
                },
            },
            { $unwind: "$player" },
        ])
        .toArray();

    const result: MatchResult[] = [];

    for (const game of games) {
        const related = completions.filter((c) => c.gameId.equals(game._id));
        const statusMap = new Map<string, CompletionStatus>(
            related.map((c) => [c.playerId.toString(), c.status as CompletionStatus]),
        );
        const nameMap = new Map<string, string>(related.map((c) => [c.playerId.toString(), c.player.name as string]));

        let completedCount = 0;
        const incompletePlayers: string[] = [];

        for (const pid of playerIds) {
            const status = statusMap.get(pid);
            const name = nameMap.get(pid);
            if (status === CompletionStatus.DONE) {
                completedCount++;
            } else {
                if (name) incompletePlayers.push(name);
            }
        }

        const total = playerIds.length || 1;
        const completionRate = completedCount / total;

        // 모두 미완료면 보너스 점수
        const allIncompleteBonus = completedCount === 0 ? 50 : 0;
        const matchScore = (1 - completionRate) * 100 + allIncompleteBonus;

        result.push({
            ...(game as Game),
            matchScore,
            incompletePlayers,
        });
    }

    return result.sort((a, b) => b.matchScore - a.matchScore);
}

