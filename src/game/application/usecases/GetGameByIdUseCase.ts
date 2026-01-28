import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGameByIdUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(id: string): Promise<ReturnType<IGameRepository["findById"]>> {
        return this.gameRepository.findById(id);
    }
}
