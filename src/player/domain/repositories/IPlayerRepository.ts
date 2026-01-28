import type { Player } from "@player/domain/entities/Player";

export interface IPlayerRepository {
    findAll(): Promise<Player[]>;
    findById(id: string): Promise<Player | null>;
    findByName(name: string): Promise<Player | null>;
    upsert(name: string): Promise<Player>;
    findByIds(ids: string[]): Promise<Player[]>;
}
