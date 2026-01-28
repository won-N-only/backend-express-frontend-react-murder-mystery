import { ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import type { Game } from "../../types/domain";

const COLLECTION = "games";

export async function listGames(): Promise<Game[]> {
    const db = await getDb();
    return db.collection<Game>(COLLECTION).find({}).sort({ orderNumber: 1 }).toArray();
}

export async function getGameById(id: string): Promise<Game | null> {
    const db = await getDb();
    return db.collection<Game>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createGame(payload: Omit<Game, "_id" | "createdAt" | "updatedAt">): Promise<Game> {
    const db = await getDb();
    const now = new Date();
    const doc: Game = {
        ...payload,
        createdAt: now,
        updatedAt: now,
    };
    const result = await db.collection<Game>(COLLECTION).insertOne(doc);
    return { ...doc, _id: result.insertedId };
}

export async function updateGame(id: string, updates: Partial<Omit<Game, "_id" | "createdAt">>): Promise<Game | null> {
    const db = await getDb();
    const _id = new ObjectId(id);
    const updateDoc: any = {
        ...updates,
        updatedAt: new Date(),
    };
    const result = await db
        .collection<Game>(COLLECTION)
        .findOneAndUpdate({ _id }, { $set: updateDoc }, { returnDocument: "after" });
    return result ?? null;
}

export async function deleteGame(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection<Game>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}

export async function listGamesByPlayerCount(minPlayers: number, maxPlayers?: number): Promise<Game[]> {
    const db = await getDb();
    const query: any = {
        minPlayers: { $lte: maxPlayers ?? minPlayers },
    };
    if (maxPlayers != null) {
        query.$or = [{ maxPlayers: null }, { maxPlayers: { $gte: minPlayers } }];
    } else {
        query.$or = [{ maxPlayers: null }, { maxPlayers: { $gte: minPlayers } }];
    }

    return db.collection<Game>(COLLECTION).find(query).sort({ orderNumber: 1 }).toArray();
}

