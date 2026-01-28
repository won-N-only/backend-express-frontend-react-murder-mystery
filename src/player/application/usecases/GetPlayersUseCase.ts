import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";

export class GetPlayersUseCase {
    constructor(private playerRepository: IPlayerRepository) { }

    async execute(): Promise<ReturnType<IPlayerRepository["findAll"]>> {
        return this.playerRepository.findAll();
    }
}
