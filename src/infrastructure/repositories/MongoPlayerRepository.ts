import { ObjectId } from "mongodb";
import { Player } from "../../domain/entities/Player";
import type { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { MongoDatabase } from "../database/MongoDatabase";

export class MongoPlayerRepository implements IPlayerRepository {
    private static readonly COLLECTION_NAME = "players";
    async findAll(): Promise<Player[]> {
        const db = await MongoDatabase.getDb();
        const players = await db
            .collection(MongoPlayerRepository.COLLECTION_NAME)
            .find({})
            .sort({ name: 1 })
            .toArray();
        return players.map(this.toDomain);
    }

    async findById(id: string): Promise<Player | null> {
        const db = await MongoDatabase.getDb();
        const player = await db
            .collection(MongoPlayerRepository.COLLECTION_NAME)
            .findOne({ _id: new ObjectId(id) });
        return player ? this.toDomain(player) : null;
    }

    async findByName(name: string): Promise<Player | null> {
        const db = await MongoDatabase.getDb();
        const player = await db.collection(MongoPlayerRepository.COLLECTION_NAME).findOne({ name });
        return player ? this.toDomain(player) : null;
    }

    async upsert(name: string): Promise<Player> {
        const db = await MongoDatabase.getDb();
        const now = new Date();
        const result = await db
            .collection(MongoPlayerRepository.COLLECTION_NAME)
            .findOneAndUpdate(
                { name },
                { $setOnInsert: { name, createdAt: now } },
                { upsert: true, returnDocument: "after" },
            );
        return this.toDomain(result ?? { _id: new ObjectId(), name, createdAt: now });
    }

    async findByIds(ids: string[]): Promise<Player[]> {
        const db = await MongoDatabase.getDb();
        const objectIds = ids.map((id) => new ObjectId(id));
        const players = await db
            .collection(MongoPlayerRepository.COLLECTION_NAME)
            .find({ _id: { $in: objectIds } })
            .toArray();
        return players.map(this.toDomain);
    }

    private toDomain(document: any): Player {
        return new Player(document._id, document.name, document.lastUpdated ?? null, document.createdAt);
    }
}
