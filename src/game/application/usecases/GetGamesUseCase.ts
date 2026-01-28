import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGamesUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(): Promise<ReturnType<IGameRepository["findAll"]>> {
        return this.gameRepository.findAll();
    }
}
