import type { Game } from "@game/domain/entities/Game";

export interface CompanyStat {
    company: string;
    gameCount: number;
}

export interface IGameRepository {
    findAll(): Promise<Game[]>;
    findById(id: string): Promise<Game | null>;
    findByIds(ids: string[]): Promise<Game[]>;
    findByPlayerCount(minPlayers: number, maxPlayers?: number): Promise<Game[]>;
    create(game: Game): Promise<Game>;
    update(id: string, game: Partial<Game>): Promise<Game | null>;
    delete(id: string): Promise<boolean>;
    getCompanyStats(): Promise<CompanyStat[]>;
    getNextOrderNumber(): Promise<number>;
}
