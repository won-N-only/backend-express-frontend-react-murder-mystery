import { toCompletionDto } from "@app/api/_mappers";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import {
    getDeleteCompletionUseCase,
    getUpsertCompletionUseCase,
} from "@shared/infrastructure/di/container";

export interface UpsertCompletionBody {
    playerId: string;
    status: number;
}

export async function upsertCompletion(gameId: string, body: UpsertCompletionBody) {
    const { playerId, status } = body;
    const { completion } = await getUpsertCompletionUseCase().execute(
        gameId,
        playerId,
        status as CompletionStatus,
    );

    return { completion: toCompletionDto(completion) };
}

export async function deleteCompletion(gameId: string, playerId: string) {
    await getDeleteCompletionUseCase().execute(gameId, playerId);

    return { success: true };
}
