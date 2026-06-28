import type { GameCategory } from "@game/domain/enums/GameCategory";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGamesUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(category?: GameCategory | null): Promise<ReturnType<IGameRepository["findAll"]>> {
        return this.gameRepository.findAll(category);
    }
}
