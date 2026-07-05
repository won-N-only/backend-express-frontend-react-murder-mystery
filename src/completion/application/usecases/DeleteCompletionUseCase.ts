import { CompletionDeletedEvent } from "@completion/domain/events/CompletionEvents";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IEventBus } from "@shared/domain/events/IEventBus";

export interface DeleteCompletionResult {
    deleted: boolean;
    /** 삭제된 레코드가 DONE이었으면 -1, 아니면 0 */
    delta: number;
}

export class DeleteCompletionUseCase {
    constructor(
        private completionRepository: IGameCompletionRepository,
        private eventBus: IEventBus,
    ) {}

    async execute(gameId: string, playerId: string): Promise<DeleteCompletionResult> {
        const previousStatus = await this.completionRepository.delete(gameId, playerId);

        if (previousStatus !== null) {
            await this.eventBus.publish(
                new CompletionDeletedEvent(gameId, playerId, previousStatus),
            );
        }

        const delta = previousStatus === CompletionStatus.DONE ? -1 : 0;
        return { deleted: previousStatus !== null, delta };
    }
}
