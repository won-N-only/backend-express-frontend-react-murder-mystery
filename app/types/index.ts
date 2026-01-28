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
