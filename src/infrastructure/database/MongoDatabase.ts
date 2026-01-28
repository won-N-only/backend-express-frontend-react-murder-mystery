import assert from "assert";
import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
    throw new Error("MONGODB_URI 환경 변수가 설정되어 있지 않습니다.");
}

if (!dbName) {
    throw new Error("MONGODB_DB_NAME 환경 변수가 설정되어 있지 않습니다.");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export class MongoDatabase {
    static async getMongoClient(): Promise<MongoClient> {
        if (cachedClient) return cachedClient;
        assert(uri, "MONGODB_URI is required");
        const client = new MongoClient(uri);
        await client.connect();
        cachedClient = client;
        return client;
    }

    static async getDb(): Promise<Db> {
        if (cachedDb) return cachedDb;
        const client = await MongoDatabase.getMongoClient();
        const db = client.db(dbName);
        cachedDb = db;
        return db;
    }
}

// 기존 코드와의 호환성을 위한 export
export async function getDb(): Promise<Db> {
    return MongoDatabase.getDb();
}

export async function getMongoClient(): Promise<MongoClient> {
    return MongoDatabase.getMongoClient();
}
