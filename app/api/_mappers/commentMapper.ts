import type { Comment } from "@comment/domain/entities/Comment";

export interface CommentDto {
    _id: string;
    gameId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
    parentId: string | null;
}

export function toCommentDto(comment: Comment): CommentDto {
    return {
        _id: comment.id?.toString() ?? "",
        gameId: comment.gameId.toString(),
        authorId: comment.authorId.toString(),
        authorName: comment.authorName,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        parentId: comment.parentId?.toString() ?? null,
    };
}
