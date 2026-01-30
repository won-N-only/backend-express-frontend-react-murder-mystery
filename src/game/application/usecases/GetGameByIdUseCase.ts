import type { Game } from "@game/domain/entities/Game";
import { GameNotFoundError } from "@game/domain/errors/GameNotFoundError";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetGameByIdUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(id: string): Promise<Game> {
        const game = await this.gameRepository.findById(id);
        if (!game) {
            throw new GameNotFoundError(id);
        }
        return game;
    }
}
