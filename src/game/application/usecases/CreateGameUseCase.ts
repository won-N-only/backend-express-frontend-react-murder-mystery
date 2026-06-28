import { Game } from "@game/domain/entities/Game";
import type { GameCategory } from "@game/domain/enums/GameCategory";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export interface CreateGameRequest {
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    category?: GameCategory | null;
    thumbnail?: string | null;
    description?: string | null;
    ownerNote?: string[] | null;
}

export class CreateGameUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(request: CreateGameRequest): Promise<Game> {
        const orderNumber = await this.gameRepository.getNextOrderNumber();
        const now = new Date();
        const game = new Game(
            undefined,
            orderNumber,
            request.name,
            request.minPlayers,
            request.maxPlayers ?? null,
            request.company ?? null,
            request.series ?? null,
            request.category ?? null,
            request.ownerNote ?? null,
            request.thumbnail ?? null,
            request.description ?? null,
            now,
            now,
        );
        return this.gameRepository.create(game);
    }
}
