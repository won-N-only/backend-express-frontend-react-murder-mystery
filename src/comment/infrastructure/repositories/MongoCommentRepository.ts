import { Comment } from "@comment/domain/entities/Comment";
import type { ICommentRepository } from "@comment/domain/repositories/ICommentRepository";
import { MongoDatabase } from "@shared/infrastructure/database/MongoDatabase";
import { ObjectId } from "mongodb";

export class MongoCommentRepository implements ICommentRepository {
    private static readonly COLLECTION_NAME = "comments";

    async save(comment: Comment): Promise<Comment> {
        const db = await MongoDatabase.getDb();
        const doc = {
            _id: comment.id ?? new ObjectId(),
            gameId: comment.gameId,
            authorId: comment.authorId,
            authorName: comment.authorName,
            content: comment.content,
            createdAt: comment.createdAt,
            parentId: comment.parentId,
        };
        await db.collection(MongoCommentRepository.COLLECTION_NAME).updateOne(
            { _id: doc._id },
            { $set: doc },
            { upsert: true },
        );
        return this.toDomain(doc);
    }

    async findByGameId(gameId: string): Promise<Comment[]> {
        const db = await MongoDatabase.getDb();
        const list = await db
            .collection(MongoCommentRepository.COLLECTION_NAME)
            .find({ gameId: new ObjectId(gameId) })
            .sort({ createdAt: 1 })
            .toArray();
        return list.map(this.toDomain);
    }

    async delete(id: string): Promise<boolean> {
        const db = await MongoDatabase.getDb();
        const result = await db
            .collection(MongoCommentRepository.COLLECTION_NAME)
            .deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }

    private toDomain(doc: any): Comment {
        return new Comment(
            doc._id,
            doc.gameId,
            doc.authorId,
            doc.authorName,
            doc.content,
            doc.createdAt,
            doc.parentId ?? null,
        );
    }
}
