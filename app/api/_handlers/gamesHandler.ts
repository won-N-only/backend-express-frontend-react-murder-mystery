import { toGameDto } from "@app/api/_mappers";
import { sanitizeText, sanitizeTextArray } from "@app/lib/sanitizer";
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
    ownerNote?: string[] | string | null;
}

export async function createGame(body: CreateGameBody) {
    const useCase = getCreateGameUseCase();

    const ownerNoteArray =
        body.ownerNote && typeof body.ownerNote === "string"
            ? body.ownerNote.split("\n")
            : body.ownerNote;

    const sanitizedName = sanitizeText(body.name);
    if (!sanitizedName) {
        throw new Error("name이 유효하지 않습니다.");
    }

    const created = await useCase.execute({
        name: sanitizedName,
        minPlayers: Number(body.minPlayers) ?? 2,
        maxPlayers: body.maxPlayers != null ? Number(body.maxPlayers) || null : null,
        company: sanitizeText(body.company),
        series: sanitizeText(body.series),
        thumbnail: sanitizeText(body.thumbnail),
        description: sanitizeText(body.description),
        ownerNote: sanitizeTextArray(ownerNoteArray as string[]),
    });
    return { game: toGameDto(created) };
}
