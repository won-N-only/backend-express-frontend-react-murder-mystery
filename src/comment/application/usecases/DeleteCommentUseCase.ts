import { CommentNotFoundError } from "@comment/domain/errors/CommentNotFoundError";
import type { ICommentRepository } from "@comment/domain/repositories/ICommentRepository";

export class DeleteCommentUseCase {
    constructor(private commentRepository: ICommentRepository) { }

    async execute(commentId: string): Promise<void> {
        const ok = await this.commentRepository.delete(commentId);
        if (!ok) {
            throw new CommentNotFoundError(commentId);
        }
    }
}
