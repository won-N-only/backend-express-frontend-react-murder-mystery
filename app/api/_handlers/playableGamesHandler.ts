import { getGetPlayableGamesByPlayersUseCase } from "@shared/infrastructure/di/container";
import { toGameDto } from "@app/api/_mappers";

export async function getPlayableGames(playerIds: string[]) {
    const useCase = getGetPlayableGamesByPlayersUseCase();
    const games = await useCase.execute(playerIds);
    return { games: games.map(toGameDto) };
}