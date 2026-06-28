import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";

export interface DeleteCompletionResult {
    deleted: boolean;
    /** 삭제된 레코드가 DONE이었으면 -1, 아니면 0 */
    delta: number;
}

export class DeleteCompletionUseCase {
    constructor(private completionRepository: IGameCompletionRepository) {}

    async execute(gameId: string, playerId: string): Promise<DeleteCompletionResult> {
        const previousStatus = await this.completionRepository.delete(gameId, playerId);
        const deleted = previousStatus !== null;
        const delta = previousStatus === CompletionStatus.DONE ? -1 : 0;
        return { deleted, delta };
    }
}
