import type { Game } from "@game/domain/entities/Game";
import { GameNotFoundError } from "@game/domain/errors/GameNotFoundError";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class UpdateGameUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(id: string, game: Partial<Game>): Promise<Game> {
        const updated = await this.gameRepository.update(id, game);
        if (!updated) {
            throw new GameNotFoundError(id);
        }
        return updated;
    }
}
