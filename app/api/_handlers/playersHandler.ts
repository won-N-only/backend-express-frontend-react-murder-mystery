import { toPlayerDto } from "@app/api/_mappers";
import { getGetPlayersUseCase, getUpsertPlayerUseCase } from "@shared/infrastructure/di/container";

export async function getPlayers() {
    const useCase = getGetPlayersUseCase();
    const players = await useCase.execute();
    return { players: players.map(toPlayerDto) };
}

export interface CreatePlayerBody {
    name: string;
}

export async function createPlayer(body: CreatePlayerBody) {
    const useCase = getUpsertPlayerUseCase();
    const player = await useCase.execute(body.name);
    return { player: toPlayerDto(player) };
}
