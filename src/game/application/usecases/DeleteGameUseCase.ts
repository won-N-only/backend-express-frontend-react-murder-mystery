import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class DeleteGameUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(id: string): Promise<boolean> {
        return this.gameRepository.delete(id);
    }
}
