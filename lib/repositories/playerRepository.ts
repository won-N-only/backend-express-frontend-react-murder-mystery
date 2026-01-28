import { ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import type { Player } from "../../types/domain";

const COLLECTION = "players";

export async function listPlayers(): Promise<Player[]> {
    const db = await getDb();
    return db.collection<Player>(COLLECTION).find({}).sort({ name: 1 }).toArray();
}

export async function getPlayerById(id: string): Promise<Player | null> {
    const db = await getDb();
    return db.collection<Player>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function getPlayerByName(name: string): Promise<Player | null> {
    const db = await getDb();
    return db.collection<Player>(COLLECTION).findOne({ name });
}

export async function upsertPlayer(name: string): Promise<Player> {
    const db = await getDb();
    const now = new Date();
    const result = await db
        .collection<Player>(COLLECTION)
        .findOneAndUpdate(
            { name },
            { $setOnInsert: { name, createdAt: now } },
            { upsert: true, returnDocument: "after" },
        );
    // findOneAndUpdate with upsert always returns a value in recent drivers
    // but we guard just in case
    return (
        result ?? {
            _id: new ObjectId(),
            name,
            createdAt: now,
        }
    );
}

