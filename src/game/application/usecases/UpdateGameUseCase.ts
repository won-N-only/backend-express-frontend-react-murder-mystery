import type { Game } from "@game/domain/entities/Game";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class UpdateGameUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(id: string, game: Partial<Game>): Promise<Game | null> {
        return this.gameRepository.update(id, game);
    }
}
