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
    ownerNote?: string[] | null;
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
    excludePartySeries?: boolean;
}

export interface MatchResult extends Game {
    matchScore: number;
    incompletePlayers: string[];
}

// 조합 기반 매칭 (선택된 모든 참가자를 사용)
export interface CombinationMatchRequest {
    playerIds: string[]; // 전체 참가자 ID 배열
    excludePartySeries?: boolean;
    excludeSinglePlayer?: boolean;
}

export interface GameGroup {
    game: Game;
    assignedPlayers: string[]; // 이 게임에 배정된 참가자 ID들
    playerNames: string[]; // 참가자 이름들
    matchScore: number;
    allIncomplete: boolean; // 모두 미완료인지
}

export interface CombinationMatchResult {
    groups: GameGroup[]; // 게임 그룹들 (예: [게임1+[a,b,c], 게임2+[d,e,f]])
    totalScore: number; // 전체 조합 점수
    unusedPlayers: string[]; // 사용되지 않은 참가자들
}

export interface PlayerStats {
    playerId: string;
    playerName: string;
    completedCount: number;
    totalGames: number;
    completionRate: number;
}

