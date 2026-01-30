import { getGetCompletedGamesByPlayerIdUseCase } from "@shared/infrastructure/di/container";

export async function getCompletedGamesByPlayerId(playerId: string) {
    const useCase = getGetCompletedGamesByPlayerIdUseCase();
    const completedGames = await useCase.execute(playerId);
    return { completedGames };
}
