import { toCompletionDto, toGameDto } from "@app/api/_mappers";
import { sanitizeText, sanitizeTextArray } from "@app/lib/sanitizer";
import {
    getDeleteGameUseCase,
    getGetCompletionsByGameIdUseCase,
    getGetGameByIdUseCase,
    getUpdateGameUseCase,
} from "@shared/infrastructure/di/container";

export async function getGameById(gameId: string) {
    const getGameByIdUseCase = getGetGameByIdUseCase();
    const game = await getGameByIdUseCase.execute(gameId);
    return {
        game: toGameDto(game),
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
    let arr: string[] = [];
    if (Array.isArray(ownerNote)) {
        arr = ownerNote.filter((s) => typeof s === "string" && s.trim().length > 0);
    } else if (typeof ownerNote === "string" && ownerNote.trim().length > 0) {
        arr = ownerNote.split(",").map((s) => s.trim());
    }
    const sanitizedArr = sanitizeTextArray(arr);
    return sanitizedArr && sanitizedArr.length > 0 ? sanitizedArr : null;
}

export async function updateGame(gameId: string, body: UpdateGameBody) {
    const updateData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body)) {
        if (value !== undefined) {
            switch (key) {
                case "name":
                case "company":
                case "series":
                case "description":
                case "thumbnail":
                    updateData[key] = sanitizeText(value as string | null);
                    break;
                case "ownerNote":
                    updateData[key] = normalizeOwnerNote(value);
                    break;
                default:
                    updateData[key] = value;
                    break;
            }
        }
    }

    const useCase = getUpdateGameUseCase();
    const updated = await useCase.execute(gameId, updateData as Parameters<typeof useCase.execute>[1]);
    return { game: toGameDto(updated) };
}

export async function deleteGame(gameId: string) {
    const useCase = getDeleteGameUseCase();
    await useCase.execute(gameId);
    return { success: true };
}
