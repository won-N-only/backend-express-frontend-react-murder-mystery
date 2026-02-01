import { toPlayerDto } from "@app/api/_mappers";
import { sanitizeText } from "@app/lib/sanitizer";
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

    const sanitizedName = sanitizeText(body.name);
    if (!sanitizedName) {
        throw new Error("name이 유효하지 않습니다.");
    }

    const player = await useCase.execute(sanitizedName);
    return { player: toPlayerDto(player) };
}
