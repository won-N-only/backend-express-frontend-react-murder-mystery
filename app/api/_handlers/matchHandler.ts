import { toCombinationDto, toMatchResultDto } from "@app/api/_mappers";
import {
    getFindCombinationMatchesUseCase,
    getFindMatchesUseCase,
} from "@shared/infrastructure/di/container";

export interface MatchRequestBody {
    playerIds: string[];
    playerCount?: number;
    useCombination?: boolean;
    excludePartySeries?: boolean;
    excludeSinglePlayer?: boolean;
    excludeTwoPlayer?: boolean;
    numGroups?: number;
}

export async function findMatches(body: MatchRequestBody) {
    const {
        playerIds,
        playerCount,
        useCombination,
        excludePartySeries,
        excludeSinglePlayer,
        excludeTwoPlayer,
        numGroups,
    } = body;

    if (useCombination) {
        const useCase = getFindCombinationMatchesUseCase();
        const combinations = await useCase.execute({
            playerIds,
            excludePartySeries: excludePartySeries ?? false,
            excludeSinglePlayer: excludeSinglePlayer ?? false,
            excludeTwoPlayer: excludeTwoPlayer ?? false,
            numGroups,
        });
        return {
            combinations: combinations.map(toCombinationDto),
            type: "combination" as const,
        };
    }

    const useCase = getFindMatchesUseCase();
    const matches = await useCase.execute({
        playerIds,
        playerCount: playerCount!,
        excludePartySeries: excludePartySeries ?? false,
        excludeSinglePlayer: excludeSinglePlayer ?? false,
        excludeTwoPlayer: excludeTwoPlayer ?? false,
    });
    return {
        matches: matches.map(toMatchResultDto),
        type: "single" as const,
    };
}
