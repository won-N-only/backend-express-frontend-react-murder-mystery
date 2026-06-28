import type { GameCategory } from "@game/domain/enums/GameCategory";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGamesByPlayerCountUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(
        minPlayers: number,
        maxPlayers?: number,
        category?: GameCategory | null,
    ): Promise<ReturnType<IGameRepository["findByPlayerCount"]>> {
        return this.gameRepository.findByPlayerCount(minPlayers, maxPlayers, category);
    }
}
