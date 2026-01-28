import type { GameCompletion } from "@completion/domain/entities/GameCompletion";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";

export interface IGameCompletionRepository {
    upsert(gameId: string, playerId: string, status: CompletionStatus): Promise<GameCompletion>;
    delete(gameId: string, playerId: string): Promise<boolean>;
    findByGameId(gameId: string): Promise<GameCompletion[]>;
    findByGameIdAndPlayerIds(gameId: string, playerIds: string[]): Promise<GameCompletion[]>;
    findByGameIdsAndPlayerIds(gameIds: string[], playerIds: string[]): Promise<GameCompletion[]>;
}
