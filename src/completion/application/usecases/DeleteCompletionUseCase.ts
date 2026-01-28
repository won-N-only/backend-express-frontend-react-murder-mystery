import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";

export class DeleteCompletionUseCase {
    constructor(private completionRepository: IGameCompletionRepository) { }

    async execute(gameId: string, playerId: string): Promise<boolean> {
        return this.completionRepository.delete(gameId, playerId);
    }
}
