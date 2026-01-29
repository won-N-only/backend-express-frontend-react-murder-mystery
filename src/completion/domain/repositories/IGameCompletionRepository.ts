import type { GameCompletion } from "@completion/domain/entities/GameCompletion";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";

export interface CompletionCountByGame {
    gameId: string;
    count: number;
}

export interface CompletionCountByPlayer {
    playerId: string;
    count: number;
}

export interface IGameCompletionRepository {
    upsert(gameId: string, playerId: string, status: CompletionStatus): Promise<GameCompletion>;
    delete(gameId: string, playerId: string): Promise<boolean>;
    findByGameId(gameId: string): Promise<GameCompletion[]>;
    findByGameIdAndPlayerIds(gameId: string, playerIds: string[]): Promise<GameCompletion[]>;
    findByGameIdsAndPlayerIds(gameIds: string[], playerIds: string[], status?: CompletionStatus): Promise<GameCompletion[]>;
    findByPlayerId(playerId: string, status?: CompletionStatus): Promise<GameCompletion[]>;
    // 집계 메서드: DB 레벨에서 집계하여 성능 최적화
    countByGameIds(gameIds: string[], playerIds: string[], status: CompletionStatus): Promise<CompletionCountByGame[]>;
    countByPlayerIds(gameIds: string[], playerIds: string[], status: CompletionStatus): Promise<CompletionCountByPlayer[]>;
}
