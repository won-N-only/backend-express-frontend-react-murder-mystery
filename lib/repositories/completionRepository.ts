import { ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import type { GameCompletion } from "../../types/domain";
import { CompletionStatus } from "../../types/domain";

const COLLECTION = "gameCompletions";

export async function upsertCompletion(
    gameId: string,
    playerId: string,
    status: CompletionStatus,
): Promise<GameCompletion> {
    const db = await getDb();
    const now = new Date();
    const filter = { gameId: new ObjectId(gameId), playerId: new ObjectId(playerId) };
    const update = {
        $set: {
            status,
            completedAt: status === CompletionStatus.DONE ? now : null,
        },
        $setOnInsert: {
            createdAt: now,
        },
    };

    const result = await db
        .collection<GameCompletion>(COLLECTION)
        .findOneAndUpdate(filter, update, { upsert: true, returnDocument: "after" });
    return result!;
}

export async function deleteCompletion(gameId: string, playerId: string): Promise<boolean> {
    const db = await getDb();
    const result = await db
        .collection<GameCompletion>(COLLECTION)
        .deleteOne({ gameId: new ObjectId(gameId), playerId: new ObjectId(playerId) });
    return result.deletedCount === 1;
}

export async function listCompletionsForGame(gameId: string) {
    const db = await getDb();
    return db
        .collection<GameCompletion>(COLLECTION)
        .aggregate([
            { $match: { gameId: new ObjectId(gameId) } },
            {
                $lookup: {
                    from: "players",
                    localField: "playerId",
                    foreignField: "_id",
                    as: "player",
                },
            },
            { $unwind: "$player" },
            {
                $project: {
                    _id: 1,
                    gameId: 1,
                    playerId: 1,
                    status: 1,
                    completedAt: 1,
                    playerName: "$player.name",
                },
            },
        ])
        .toArray();
}

export async function listCompletionsForPlayers(gameId: string, playerIds: string[]) {
    const db = await getDb();
    const objectIds = playerIds.map((id) => new ObjectId(id));
    return db
        .collection<GameCompletion>(COLLECTION)
        .find({ gameId: new ObjectId(gameId), playerId: { $in: objectIds } })
        .toArray();
}

