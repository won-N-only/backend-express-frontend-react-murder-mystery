import { Comment } from "@comment/domain/entities/Comment";
import type { ICommentRepository } from "@comment/domain/repositories/ICommentRepository";
import { ObjectId } from "mongodb";

export interface CreateCommentRequest {
    gameId: string;
    authorId: string;
    authorName: string;
    content: string;
    parentId?: string | null;
}

export class CreateCommentUseCase {
    constructor(private commentRepository: ICommentRepository) { }

    async execute(request: CreateCommentRequest): Promise<Comment> {
        const now = new Date();
        const comment = new Comment(
            undefined,
            new ObjectId(request.gameId),
            new ObjectId(request.authorId),
            request.authorName,
            request.content.trim(),
            now,
            request.parentId ? new ObjectId(request.parentId) : null,
        );
        return this.commentRepository.save(comment);
    }
}
