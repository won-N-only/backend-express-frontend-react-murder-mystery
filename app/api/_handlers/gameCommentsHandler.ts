import { toCommentDto } from "@app/api/_mappers";
import { sanitizeText } from "@app/lib/sanitizer";
import {
    getCreateCommentUseCase,
    resolveCommentsByGameIdUseCase,
} from "@shared/infrastructure/di/container";

export async function getCommentsByGameId(gameId: string) {
    const useCase = resolveCommentsByGameIdUseCase();
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

    const sanitizedAuthorName = sanitizeText(body.authorName);
    const sanitizedContent = sanitizeText(body.content);

    if (!sanitizedAuthorName || !sanitizedContent) {
        throw new Error("authorName 또는 content가 유효하지 않습니다.");
    }

    const comment = await useCase.execute({
        gameId,
        authorId: body.authorId,
        authorName: sanitizedAuthorName,
        content: sanitizedContent,
        parentId: body.parentId ?? null,
    });
    return { comment: toCommentDto(comment) };
}
