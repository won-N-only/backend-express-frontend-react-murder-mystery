import type { Game } from "../entities/Game";

export interface IGameRepository {
    findAll(): Promise<Game[]>;
    findById(id: string): Promise<Game | null>;
    findByPlayerCount(minPlayers: number, maxPlayers?: number): Promise<Game[]>;
    create(game: Game): Promise<Game>;
    update(id: string, game: Partial<Game>): Promise<Game | null>;
    delete(id: string): Promise<boolean>;
}
