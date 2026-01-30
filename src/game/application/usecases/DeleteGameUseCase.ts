import { GameNotFoundError } from "@game/domain/errors/GameNotFoundError";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class DeleteGameUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(id: string): Promise<void> {
        const ok = await this.gameRepository.delete(id);
        if (!ok) {
            throw new GameNotFoundError(id);
        }
    }
}
