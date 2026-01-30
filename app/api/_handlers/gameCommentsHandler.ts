import { toCommentDto } from "@app/api/_mappers";
import {
    getCreateCommentUseCase,
    getGetCommentsByGameIdUseCase,
} from "@shared/infrastructure/di/container";

export async function getCommentsByGameId(gameId: string) {
    const useCase = getGetCommentsByGameIdUseCase();
    const comments = await useCase.execute(gameId);
    return { comments: comments.map(toCommentDto) };
}

export interface CreateCommentBody {
    authorId: string;
    authorName: string;
    content: string;
    parentId?: string | null;
}

export async function createComment(gameId: string, body: CreateCommentBody) {
    const useCase = getCreateCommentUseCase();
    const comment = await useCase.execute({
        gameId,
        authorId: body.authorId,
        authorName: body.authorName,
        content: body.content.trim(),
        parentId: body.parentId ?? null,
    });
    return { comment: toCommentDto(comment) };
}
