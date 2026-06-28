import type { GameCompletion } from "@completion/domain/entities/GameCompletion";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";

export interface UpsertCompletionResult {
    completion: GameCompletion;
    /** stat 변화량: +1(미완료→완료), -1(완료→미완료), 0(변화 없음) */
    delta: number;
}

export class UpsertCompletionUseCase {
    constructor(private completionRepository: IGameCompletionRepository) {}

    async execute(
        gameId: string,
        playerId: string,
        newStatus: CompletionStatus,
    ): Promise<UpsertCompletionResult> {
        const existing = await this.completionRepository.findByGameIdAndPlayerId(gameId, playerId);
        const previousStatus = existing?.status ?? CompletionStatus.NOT_DONE;

        const completion = await this.completionRepository.upsert(gameId, playerId, newStatus);

        const delta =
            previousStatus === newStatus
                ? 0
                : newStatus === CompletionStatus.DONE
                  ? 1
                  : -1;

        return { completion, delta };
    }
}
