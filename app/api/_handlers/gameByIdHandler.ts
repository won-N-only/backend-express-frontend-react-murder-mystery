import { toCompletionDto, toGameDto } from "@app/api/_mappers";
import {
    getDeleteGameUseCase,
    getGetCompletionsByGameIdUseCase,
    getGetGameByIdUseCase,
    getUpdateGameUseCase,
} from "@shared/infrastructure/di/container";

export async function getGameById(gameId: string) {
    const [getGameByIdUseCase, getCompletionsUseCase] = [
        getGetGameByIdUseCase(),
        getGetCompletionsByGameIdUseCase(),
    ];
    const [game, completions] = await Promise.all([
        getGameByIdUseCase.execute(gameId),
        getCompletionsUseCase.execute(gameId),
    ]);
    return {
        game: toGameDto(game),
        completions: completions.map(toCompletionDto),
    };
}

export interface UpdateGameBody {
    name?: string;
    minPlayers?: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    ownerNote?: string[] | string | null;
    thumbnail?: string | null;
    description?: string | null;
}

function normalizeOwnerNote(ownerNote: unknown): string[] | null {
    if (ownerNote === undefined) return undefined as unknown as string[] | null;
    if (ownerNote === null) return null;
    if (Array.isArray(ownerNote)) {
        const arr = ownerNote.filter((s) => typeof s === "string" && s.trim().length > 0);
        return arr.length > 0 ? arr : null;
    }
    if (typeof ownerNote === "string" && ownerNote.trim().length > 0) {
        const arr = ownerNote.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
        return arr.length > 0 ? arr : null;
    }
    return null;
}

export async function updateGame(gameId: string, body: UpdateGameBody) {
    const updateData: Record<string, unknown> = { ...body };
    if (body.ownerNote !== undefined) {
        updateData.ownerNote = normalizeOwnerNote(body.ownerNote);
    }
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail ?? null;
    if (body.description !== undefined) updateData.description = body.description ?? null;
    const useCase = getUpdateGameUseCase();
    const updated = await useCase.execute(gameId, updateData as Parameters<typeof useCase.execute>[1]);
    return { game: toGameDto(updated) };
}

export async function deleteGame(gameId: string) {
    const useCase = getDeleteGameUseCase();
    await useCase.execute(gameId);
    return { success: true };
}
