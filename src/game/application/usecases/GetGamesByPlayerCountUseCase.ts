import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGamesByPlayerCountUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(minPlayers: number, maxPlayers?: number): Promise<ReturnType<IGameRepository["findByPlayerCount"]>> {
        return this.gameRepository.findByPlayerCount(minPlayers, maxPlayers);
    }
}
