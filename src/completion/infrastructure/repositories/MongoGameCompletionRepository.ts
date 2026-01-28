import { MongoDatabase } from "@/src/common/infrastructure/database/MongoDatabase";
import { GameCompletion } from "@completion/domain/entities/GameCompletion";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { ObjectId } from "mongodb";

export class MongoGameCompletionRepository implements IGameCompletionRepository {
    private static readonly COLLECTION_NAME = "gameCompletions";

    async upsert(gameId: string, playerId: string, status: CompletionStatus): Promise<GameCompletion> {
        const db = await MongoDatabase.getDb();
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
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .findOneAndUpdate(filter, update, { upsert: true, returnDocument: "after" });
        return this.toDomain(result!);
    }

    async delete(gameId: string, playerId: string): Promise<boolean> {
        const db = await MongoDatabase.getDb();
        const result = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .deleteOne({ gameId: new ObjectId(gameId), playerId: new ObjectId(playerId) });
        return result.deletedCount === 1;
    }

    async findByGameId(gameId: string): Promise<GameCompletion[]> {
        const db = await MongoDatabase.getDb();
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
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
            ])
            .toArray();
        return completions.map(this.toDomain);
    }

    async findByGameIdAndPlayerIds(gameId: string, playerIds: string[]): Promise<GameCompletion[]> {
        const db = await MongoDatabase.getDb();
        const objectIds = playerIds.map((id) => new ObjectId(id));
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .find({ gameId: new ObjectId(gameId), playerId: { $in: objectIds } })
            .toArray();
        return completions.map(this.toDomain);
    }

    async findByGameIdsAndPlayerIds(gameIds: string[], playerIds: string[]): Promise<GameCompletion[]> {
        const db = await MongoDatabase.getDb();
        const gameObjectIds = gameIds.map((id) => new ObjectId(id));
        const playerObjectIds = playerIds.map((id) => new ObjectId(id));
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .find({
                gameId: { $in: gameObjectIds },
                playerId: { $in: playerObjectIds },
            })
            .toArray();
        return completions.map(this.toDomain);
    }

    private toDomain(document: any): GameCompletion {
        return new GameCompletion(
            document._id,
            document.gameId,
            document.playerId,
            document.status as CompletionStatus,
            document.completedAt ?? null,
        );
    }
}
