import { GameCompletion } from "@completion/domain/entities/GameCompletion";
import type {
    CompletionCountByGame,
    CompletionCountByPlayer,
    IGameCompletionRepository,
} from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { MongoDatabase } from "@shared/infrastructure/database/MongoDatabase";
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
            .updateOne(
                { gameId: new ObjectId(gameId), playerId: new ObjectId(playerId), deletedAt: null },
                { $set: { deletedAt: new Date() } }
            );
        return result.modifiedCount === 1;
    }

    async findByGameId(gameId: string): Promise<GameCompletion[]> {
        const db = await MongoDatabase.getDb();
        // $lookup 제거: player 정보가 필요하지 않으므로 단순 find 쿼리로 최적화
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .find({ gameId: new ObjectId(gameId), deletedAt: null })
            .toArray();
        return completions.map(this.toDomain);
    }

    async findByGameIdAndPlayerIds(gameId: string, playerIds: string[]): Promise<GameCompletion[]> {
        if (playerIds.length === 0) return [];
        const db = await MongoDatabase.getDb();
        const objectIds = playerIds.map((id) => new ObjectId(id));
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .find({ gameId: new ObjectId(gameId), playerId: { $in: objectIds }, deletedAt: null })
            .toArray();
        return completions.map(this.toDomain);
    }

    async findByGameIdsAndPlayerIds(gameIds: string[], playerIds: string[], status?: CompletionStatus): Promise<GameCompletion[]> {
        if (gameIds.length === 0 || playerIds.length === 0) return [];
        const db = await MongoDatabase.getDb();
        const gameObjectIds = gameIds.map((id) => new ObjectId(id));
        const playerObjectIds = playerIds.map((id) => new ObjectId(id));
        const query: any = {
            gameId: { $in: gameObjectIds },
            playerId: { $in: playerObjectIds },
            deletedAt: null,
        };
        if (status !== undefined) {
            query.status = status;
        }
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .find(query)
            .toArray();
        return completions.map(this.toDomain);
    }

    async findByPlayerId(playerId: string, status?: CompletionStatus): Promise<GameCompletion[]> {
        const db = await MongoDatabase.getDb();
        const query: any = { playerId: new ObjectId(playerId), deletedAt: null };
        if (status !== undefined) {
            query.status = status;
        }
        const completions = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .find(query)
            .toArray();
        return completions.map(this.toDomain);
    }

    async countByGameIds(
        gameIds: string[],
        playerIds: string[],
        status: CompletionStatus,
    ): Promise<CompletionCountByGame[]> {
        if (gameIds.length === 0 || playerIds.length === 0) return [];
        const db = await MongoDatabase.getDb();
        const gameObjectIds = gameIds.map((id) => new ObjectId(id));
        const playerObjectIds = playerIds.map((id) => new ObjectId(id));

        // 인덱스 최적화: status를 먼저 배치하여 idx_completions_status_gameId_playerId 인덱스 활용
        const results = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .aggregate<CompletionCountByGame>([
                {
                    $match: {
                        status, // equality 조건을 먼저 배치하여 인덱스 효율성 극대화
                        gameId: { $in: gameObjectIds },
                        playerId: { $in: playerObjectIds },
                        deletedAt: null,
                    },
                },
                {
                    $group: {
                        _id: "$gameId",
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        gameId: { $toString: "$_id" },
                        count: 1,
                    },
                },
            ])
            .toArray();

        return results;
    }

    async countByPlayerIds(
        gameIds: string[],
        playerIds: string[],
        status: CompletionStatus,
    ): Promise<CompletionCountByPlayer[]> {
        if (gameIds.length === 0 || playerIds.length === 0) return [];
        const db = await MongoDatabase.getDb();
        const gameObjectIds = gameIds.map((id) => new ObjectId(id));
        const playerObjectIds = playerIds.map((id) => new ObjectId(id));

        // 인덱스 최적화: status를 먼저 배치하여 idx_completions_status_gameId_playerId 인덱스 활용
        const results = await db
            .collection(MongoGameCompletionRepository.COLLECTION_NAME)
            .aggregate<CompletionCountByPlayer>([
                {
                    $match: {
                        status, // equality 조건을 먼저 배치하여 인덱스 효율성 극대화
                        gameId: { $in: gameObjectIds },
                        playerId: { $in: playerObjectIds },
                        deletedAt: null,
                    },
                },
                {
                    $group: {
                        _id: "$playerId",
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        playerId: { $toString: "$_id" },
                        count: 1,
                    },
                },
            ])
            .toArray();

        return results;
    }

    private toDomain(document: any): GameCompletion {
        // 기존 데이터 호환: X(0), PLANNED(2), ERROR(3)는 모두 NOT_DONE(0)으로 처리
        let status = document.status as CompletionStatus;
        if (status !== CompletionStatus.DONE) {
            status = CompletionStatus.NOT_DONE;
        }
        return new GameCompletion(
            document._id,
            document.gameId,
            document.playerId,
            status,
            document.completedAt ?? null,
        );
    }
}
