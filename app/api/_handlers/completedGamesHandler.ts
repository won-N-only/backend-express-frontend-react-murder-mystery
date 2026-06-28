import { resolveCompletedGamesByPlayerIdUseCase } from "@shared/infrastructure/di/container";

export async function getCompletedGamesByPlayerId(playerId: string) {
    const useCase = resolveCompletedGamesByPlayerIdUseCase();
    const completedGames = await useCase.execute(playerId);
    return { completedGames };
}
