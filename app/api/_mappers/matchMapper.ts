import type {
    FindCombinationMatchesResult,
    GameGroup,
} from "@match/application/usecases/FindCombinationMatchesUseCase";
import type { FindMatchesResult } from "@match/application/usecases/FindMatchesUseCase";
import { toGameDto } from "./gameMapper";

export interface MatchResultDto {
    _id: string;
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers: number | null;
    company: string | null;
    series: string | null;
    ownerNote: string[] | null;
    createdAt: Date;
    updatedAt: Date;
    incompletePlayers: string[];
}

export function toMatchResultDto(match: FindMatchesResult): MatchResultDto {
    const gameDto = toGameDto(match.game);
    return {
        ...gameDto,
        incompletePlayers: match.incompletePlayers,
    };
}

export interface CombinationGroupDto {
    game: ReturnType<typeof toGameDto>;
    assignedPlayers: string[];
    playerNames: string[];
    allIncomplete: boolean;
}

export interface CombinationDto {
    groups: CombinationGroupDto[];
    unusedPlayers: string[];
}

function toCombinationGroupDto(group: GameGroup): CombinationGroupDto {
    return {
        game: toGameDto(group.game),
        assignedPlayers: group.assignedPlayers,
        playerNames: group.playerNames,
        allIncomplete: group.allIncomplete,
    };
}

export function toCombinationDto(combo: FindCombinationMatchesResult): CombinationDto {
    return {
        groups: combo.groups.map(toCombinationGroupDto),
        unusedPlayers: combo.unusedPlayers,
    };
}
