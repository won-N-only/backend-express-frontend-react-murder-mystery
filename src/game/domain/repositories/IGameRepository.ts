import type { Game } from "@game/domain/entities/Game";
import type { GameCategory } from "@game/domain/enums/GameCategory";

export interface CompanyStat {
    company: string;
    gameCount: number;
}

export interface IGameRepository {
    findAll(category?: GameCategory | null): Promise<Game[]>;
    findById(id: string): Promise<Game | null>;
    findByIds(ids: string[]): Promise<Game[]>;
    findByPlayerCount(
        minPlayers: number,
        maxPlayers?: number,
        category?: GameCategory | null,
    ): Promise<Game[]>;
    create(game: Game): Promise<Game>;
    update(id: string, game: Partial<Game>): Promise<Game | null>;
    delete(id: string): Promise<boolean>;
    getCompanyStats(): Promise<CompanyStat[]>;
    getNextOrderNumber(): Promise<number>;
}
