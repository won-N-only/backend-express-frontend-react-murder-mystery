import type { IStatSnapshotRepository } from "@stats/domain/repositories/IStatSnapshotRepository";
import { MongoDatabase } from "@shared/infrastructure/database/MongoDatabase";
import { ObjectId } from "mongodb";

const COLLECTION = "statSnapshots";

export class MongoStatSnapshotRepository implements IStatSnapshotRepository {
    async incrementPlayerCount(playerId: string, delta: number): Promise<void> {
        const db = await MongoDatabase.getDb();
        await db.collection(COLLECTION).updateOne(
            { type: "player", entityId: new ObjectId(playerId) },
            { $inc: { completedCount: delta } },
            { upsert: true },
        );
    }

    async incrementGameCount(gameId: string, delta: number): Promise<void> {
        const db = await MongoDatabase.getDb();
        await db.collection(COLLECTION).updateOne(
            { type: "game", entityId: new ObjectId(gameId) },
            { $inc: { completedCount: delta } },
            { upsert: true },
        );
    }

    async getPlayerCounts(playerIds: string[]): Promise<Map<string, number>> {
        if (playerIds.length === 0) return new Map();
        const db = await MongoDatabase.getDb();
        const docs = await db
            .collection(COLLECTION)
            .find({ type: "player", entityId: { $in: playerIds.map((id) => new ObjectId(id)) } })
            .toArray();
        return new Map(
            docs.map((d) => [d.entityId.toString(), Math.max(0, d.completedCount ?? 0)]),
        );
    }

    async getGameCounts(gameIds: string[]): Promise<Map<string, number>> {
        if (gameIds.length === 0) return new Map();
        const db = await MongoDatabase.getDb();
        const docs = await db
            .collection(COLLECTION)
            .find({ type: "game", entityId: { $in: gameIds.map((id) => new ObjectId(id)) } })
            .toArray();
        return new Map(
            docs.map((d) => [d.entityId.toString(), Math.max(0, d.completedCount ?? 0)]),
        );
    }

    async rebuildAll(
        playerCounts: { playerId: string; count: number }[],
        gameCounts: { gameId: string; count: number }[],
    ): Promise<void> {
        const db = await MongoDatabase.getDb();
        const col = db.collection(COLLECTION);

        const ops = [
            ...playerCounts.map((p) => ({
                updateOne: {
                    filter: { type: "player", entityId: new ObjectId(p.playerId) },
                    update: { $set: { completedCount: p.count } },
                    upsert: true,
                },
            })),
            ...gameCounts.map((g) => ({
                updateOne: {
                    filter: { type: "game", entityId: new ObjectId(g.gameId) },
                    update: { $set: { completedCount: g.count } },
                    upsert: true,
                },
            })),
        ];

        if (ops.length > 0) {
            await col.bulkWrite(ops);
        }
    }
}
