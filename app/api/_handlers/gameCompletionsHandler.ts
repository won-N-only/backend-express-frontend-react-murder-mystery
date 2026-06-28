import { toCompletionDto } from "@app/api/_mappers";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import {
    getDeleteCompletionUseCase,
    getUpsertCompletionUseCase,
    resolveSyncStatSnapshotUseCase,
} from "@shared/infrastructure/di/container";

export interface UpsertCompletionBody {
    playerId: string;
    status: number;
}

export async function upsertCompletion(gameId: string, body: UpsertCompletionBody) {
    const { playerId, status } = body;
    const { completion, delta } = await getUpsertCompletionUseCase().execute(
        gameId,
        playerId,
        status as CompletionStatus,
    );

    if (delta !== 0) {
        await resolveSyncStatSnapshotUseCase().execute(gameId, playerId, delta);
    }

    return { completion: toCompletionDto(completion) };
}

export async function deleteCompletion(gameId: string, playerId: string) {
    const { delta } = await getDeleteCompletionUseCase().execute(gameId, playerId);

    if (delta !== 0) {
        await resolveSyncStatSnapshotUseCase().execute(gameId, playerId, delta);
    }

    return { success: true };
}
