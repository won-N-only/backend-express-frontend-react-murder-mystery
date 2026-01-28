import { Game } from "@game/domain/entities/Game";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export interface CreateGameRequest {
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    ownerNote?: string[] | null;
}

export class CreateGameUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(request: CreateGameRequest): Promise<Game> {
        const now = new Date();
        const game = new Game(
            undefined,
            request.orderNumber,
            request.name,
            request.minPlayers,
            request.maxPlayers ?? null,
            request.company ?? null,
            request.series ?? null,
            request.ownerNote ?? null,
            now,
            now,
        );
        return this.gameRepository.create(game);
    }
}
