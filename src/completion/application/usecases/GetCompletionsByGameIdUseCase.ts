import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";

export class GetCompletionsByGameIdUseCase {
    constructor(private completionRepository: IGameCompletionRepository) { }

    async execute(gameId: string) {
        return this.completionRepository.findByGameId(gameId);
    }
}
