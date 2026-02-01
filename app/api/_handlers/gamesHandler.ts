import { toGameDto } from "@app/api/_mappers";
import {
    getCreateGameUseCase,
    getGetGamesByPlayerCountUseCase,
    getGetGamesUseCase,
} from "@shared/infrastructure/di/container";

export interface GetGamesQuery {
    minPlayers?: string | null;
    maxPlayers?: string | null;
}

export async function getGamesList(query: GetGamesQuery) {
    const { minPlayers: minPlayersParam, maxPlayers: maxPlayersParam } = query;
    let games;
    if (minPlayersParam) {
        const min = parseInt(minPlayersParam, 10);
        const max = maxPlayersParam ? parseInt(maxPlayersParam, 10) : undefined;
        const useCase = getGetGamesByPlayerCountUseCase();
        games = await useCase.execute(min, max);
    } else {
        const useCase = getGetGamesUseCase();
        games = await useCase.execute();
    }
    return { games: games.map(toGameDto) };
}

export interface CreateGameBody {
    name: string;
    minPlayers?: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    ownerNote?: string[] | null;
}

export async function createGame(body: CreateGameBody) {
    const useCase = getCreateGameUseCase();
    const created = await useCase.execute({
        name: String(body.name).trim(),
        minPlayers: Number(body.minPlayers) ?? 2,
        maxPlayers: body.maxPlayers != null ? Number(body.maxPlayers) || null : null,
        company: body.company != null ? String(body.company).trim() || null : null,
        series: body.series != null ? String(body.series).trim() || null : null,
        thumbnail: body.thumbnail != null ? String(body.thumbnail).trim() || null : null,
        description: body.description != null ? String(body.description).trim() || null : null,
        ownerNote:
            body.ownerNote != null && String(body.ownerNote).trim() !== ""
                ? String(body.ownerNote).trim().split("\n")
                : null,
    });
    return { game: toGameDto(created) };
}
