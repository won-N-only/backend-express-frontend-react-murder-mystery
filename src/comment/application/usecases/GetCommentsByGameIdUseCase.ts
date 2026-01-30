import type { Comment } from "@comment/domain/entities/Comment";
import type { ICommentRepository } from "@comment/domain/repositories/ICommentRepository";

export class GetCommentsByGameIdUseCase {
    constructor(private commentRepository: ICommentRepository) { }

    async execute(gameId: string): Promise<Comment[]> {
        return this.commentRepository.findByGameId(gameId);
    }
}
