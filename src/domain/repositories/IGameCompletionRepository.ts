import type { GameCompletion } from "../entities/GameCompletion";
import { CompletionStatus } from "../valueObjects/CompletionStatus";

export interface IGameCompletionRepository {
    upsert(gameId: string, playerId: string, status: CompletionStatus): Promise<GameCompletion>;
    delete(gameId: string, playerId: string): Promise<boolean>;
    findByGameId(gameId: string): Promise<GameCompletion[]>;
    findByGameIdAndPlayerIds(gameId: string, playerIds: string[]): Promise<GameCompletion[]>;
    /**
     * 여러 게임에 대한 완료 상태를 한 번에 조회 (배치 조회)
     */
    findByGameIdsAndPlayerIds(gameIds: string[], playerIds: string[]): Promise<GameCompletion[]>;
}
