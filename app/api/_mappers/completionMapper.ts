import type { GameCompletion } from "@completion/domain/entities/GameCompletion";

export interface CompletionDto {
    _id: string | undefined;
    gameId: string;
    playerId: string;
    status: number;
    completedAt: Date | null;
}

export function toCompletionDto(completion: GameCompletion): CompletionDto {
    return {
        _id: completion.id?.toString(),
        gameId: completion.gameId.toString(),
        playerId: completion.playerId.toString(),
        status: completion.status,
        completedAt: completion.completedAt,
    };
}
