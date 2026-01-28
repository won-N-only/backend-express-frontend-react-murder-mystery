import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";

export class UpsertCompletionUseCase {
    constructor(private completionRepository: IGameCompletionRepository) { }

    async execute(gameId: string, playerId: string, status: CompletionStatus) {
        return this.completionRepository.upsert(gameId, playerId, status);
    }
}
