import type { Comment } from "@comment/domain/entities/Comment";

export interface ICommentRepository {
    save(comment: Comment): Promise<Comment>;
    findByGameId(gameId: string): Promise<Comment[]>;
    delete(id: string): Promise<boolean>;
}
