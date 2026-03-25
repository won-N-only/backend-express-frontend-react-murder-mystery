import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGamesUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(category?: string | null): Promise<ReturnType<IGameRepository["findAll"]>> {
        return this.gameRepository.findAll(category);
    }
}
