import type { GameCompletion } from "@completion/domain/entities/GameCompletion";
import { CompletionUpsertedEvent } from "@completion/domain/events/CompletionEvents";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IEventBus } from "@shared/domain/events/IEventBus";

export interface UpsertCompletionResult {
    completion: GameCompletion;
}

export class UpsertCompletionUseCase {
    constructor(
        private completionRepository: IGameCompletionRepository,
        private eventBus: IEventBus,
    ) {}

    async execute(
        gameId: string,
        playerId: string,
        newStatus: CompletionStatus,
    ): Promise<UpsertCompletionResult> {
        const existing = await this.completionRepository.findByGameIdAndPlayerId(gameId, playerId);
        const previousStatus = existing?.status ?? CompletionStatus.NOT_DONE;

        const completion = await this.completionRepository.upsert(gameId, playerId, newStatus);

        await this.eventBus.publish(
            new CompletionUpsertedEvent(gameId, playerId, previousStatus, newStatus),
        );

        return { completion };
    }
}
