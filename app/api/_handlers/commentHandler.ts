import { getDeleteCommentUseCase } from "@shared/infrastructure/di/container";

export async function deleteComment(commentId: string) {
    const useCase = getDeleteCommentUseCase();
    await useCase.execute(commentId);
    return { success: true };
}
