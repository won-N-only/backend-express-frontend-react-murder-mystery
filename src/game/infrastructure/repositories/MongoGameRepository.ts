import { MongoDatabase } from "@/src/common/infrastructure/database/MongoDatabase";
import { Game } from "@game/domain/entities/Game";
import type { CompanyStat, IGameRepository } from "@game/domain/repositories/IGameRepository";
import { Document, ObjectId } from "mongodb";

export class MongoGameRepository implements IGameRepository {
    private static readonly COLLECTION_NAME = "games";

    async findAll(): Promise<Game[]> {
        const db = await MongoDatabase.getDb();
        const games = await db
            .collection(MongoGameRepository.COLLECTION_NAME)
            .find({})
            .sort({ orderNumber: 1 })
            .toArray();
        return games.map(this.toDomain);
    }

    async findById(id: string): Promise<Game | null> {
        const db = await MongoDatabase.getDb();
        const game = await db
            .collection(MongoGameRepository.COLLECTION_NAME)
            .findOne({ _id: new ObjectId(id) });
        return game ? this.toDomain(game) : null;
    }

    async findByPlayerCount(minPlayers: number, maxPlayers?: number): Promise<Game[]> {
        const db = await MongoDatabase.getDb();
        const query: any = {
            minPlayers: { $lte: minPlayers },
        };
        if (maxPlayers) {
            query.$or = [{ maxPlayers: null }, { maxPlayers: { $gte: maxPlayers } }];
        } else {
            query.$or = [{ maxPlayers: null }, { maxPlayers: { $gte: minPlayers } }];
        }
        const games = await db
            .collection(MongoGameRepository.COLLECTION_NAME)
            .find(query)
            .sort({ orderNumber: 1 })
            .toArray();
        return games.map(this.toDomain);
    }

    async create(game: Game): Promise<Game> {
        const db = await MongoDatabase.getDb();
        const now = new Date();
        const document = {
            _id: game.id || new ObjectId(),
            orderNumber: game.orderNumber,
            name: game.name,
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            company: game.company,
            series: game.series,
            ownerNote: game.ownerNote,
            createdAt: game.createdAt || now,
            updatedAt: game.updatedAt || now,
        };
        await db.collection(MongoGameRepository.COLLECTION_NAME).insertOne(document);
        return new Game(
            document._id,
            document.orderNumber,
            document.name,
            document.minPlayers,
            document.maxPlayers,
            document.company,
            document.series,
            document.ownerNote,
            document.createdAt,
            document.updatedAt,
        );
    }

    async update(id: string, game: Partial<Game>): Promise<Game | null> {
        const db = await MongoDatabase.getDb();
        const updateData: any = { updatedAt: new Date() };
        if (game.orderNumber !== undefined) updateData.orderNumber = game.orderNumber;
        if (game.name !== undefined) updateData.name = game.name;
        if (game.minPlayers !== undefined) updateData.minPlayers = game.minPlayers;
        if (game.maxPlayers !== undefined) updateData.maxPlayers = game.maxPlayers;
        if (game.company !== undefined) updateData.company = game.company;
        if (game.series !== undefined) updateData.series = game.series;
        if (game.ownerNote !== undefined) updateData.ownerNote = game.ownerNote;

        const result = await db
            .collection(MongoGameRepository.COLLECTION_NAME)
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
        return result ? this.toDomain(result) : null;
    }

    async delete(id: string): Promise<boolean> {
        const db = await MongoDatabase.getDb();
        const result = await db
            .collection(MongoGameRepository.COLLECTION_NAME)
            .deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    async getCompanyStats(): Promise<CompanyStat[]> {
        const db = await MongoDatabase.getDb();
        const pipeline: Document[] = [
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

        return db
            .collection(MongoGameRepository.COLLECTION_NAME)
            .aggregate<CompanyStat>(pipeline)
            .toArray();
    }

    private toDomain(document: any): Game {
        return new Game(
            document._id,
            document.orderNumber,
            document.name,
            document.minPlayers,
            document.maxPlayers ?? null,
            document.company ?? null,
            document.series ?? null,
            document.ownerNote ?? null,
            document.createdAt,
            document.updatedAt,
        );
    }
}
