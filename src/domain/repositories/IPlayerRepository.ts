import type { Player } from "../entities/Player";

export interface IPlayerRepository {
    findAll(): Promise<Player[]>;
    findById(id: string): Promise<Player | null>;
    findByName(name: string): Promise<Player | null>;
    upsert(name: string): Promise<Player>;
    /**
     * 여러 플레이어를 한 번에 조회 (배치 조회)
     */
    findByIds(ids: string[]): Promise<Player[]>;
}
