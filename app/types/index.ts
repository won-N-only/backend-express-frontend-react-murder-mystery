/** API/프론트용 완료 상태 (도메인 enum과 값만 맞춤, import는 여기만) */
export const CompletionStatus = {
    NOT_DONE: 0,
    DONE: 1,
} as const;
export type CompletionStatusValue = (typeof CompletionStatus)[keyof typeof CompletionStatus];
export const CompletionStatusLabel: Record<CompletionStatusValue, string> = {
    [CompletionStatus.NOT_DONE]: "미완료",
    [CompletionStatus.DONE]: "완료",
};

export interface Player {
    _id: string;
    name: string;
}

export interface Game {
    _id: string;
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    ownerNote?: string[] | null;
    thumbnail?: string | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MatchGame {
    _id: string;
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    incompletePlayers: string[];
}

export interface CombinationGroup {
    game: Game;
    assignedPlayers: string[];
    playerNames: string[];
    allIncomplete: boolean;
}

export interface Combination {
    groups: CombinationGroup[];
    unusedPlayers: string[];
}

export interface PlayerStat {
    playerId: string;
    playerName: string;
    completedCount: number;
    totalGames: number;
    completionRate: number;
}

export interface GameCompletionStat {
    id: string;
    name: string;
    completedCount: number;
    totalPlayers: number;
    completionRate: number;
}

export interface CompanyStat {
    company: string;
    gameCount: number;
}

/** 게임 기록/완료한 게임 목록에서 사용하는 완료 게임 항목 */
export interface CompletedGame {
    gameId: string;
    gameName: string;
    orderNumber: number;
    completedAt: Date | null;
}

/** 게임 댓글 (parentId 있으면 대댓글) */
export interface Comment {
    _id: string;
    gameId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
    parentId: string | null;
}
