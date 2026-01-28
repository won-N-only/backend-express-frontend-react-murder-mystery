import type { ObjectId } from "mongodb";

export enum CompletionStatus {
    X = 0,
    DONE = 1,
    PLANNED = 2,
    ERROR = 3,
}

export const CompletionStatusLabel: Record<CompletionStatus, string> = {
    [CompletionStatus.X]: "X",
    [CompletionStatus.DONE]: "완료",
    [CompletionStatus.PLANNED]: "예정",
    [CompletionStatus.ERROR]: "에러플💦",
};

export interface Game {
    _id?: ObjectId;
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    ownerNote?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Player {
    _id?: ObjectId;
    name: string;
    lastUpdated?: Date | null;
    createdAt: Date;
}

export interface GameCompletion {
    _id?: ObjectId;
    gameId: ObjectId;
    playerId: ObjectId;
    status: CompletionStatus;
    completedAt?: Date | null;
}

export interface MatchRequest {
    playerIds: string[]; // ObjectId string
    playerCount: number;
}

export interface MatchResult extends Game {
    matchScore: number;
    incompletePlayers: string[];
}

export interface PlayerStats {
    playerId: string;
    playerName: string;
    completedCount: number;
    totalGames: number;
    completionRate: number;
}

