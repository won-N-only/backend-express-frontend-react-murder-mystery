import { toCompletionDto, toGameDto } from "@app/api/_mappers";
import { sanitizeText, sanitizeTextArray } from "@app/lib/sanitizer";
import {
    getDeleteGameUseCase,
    getGetCompletionsByGameIdUseCase,
    resolveGameByIdUseCase,
    getUpdateGameUseCase,
} from "@shared/infrastructure/di/container";

export async function getGameById(gameId: string) {
    const getGameByIdUseCase = resolveGameByIdUseCase();
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
    /**
     * 게임 카테고리 코드 (0~4)
     * 0: 선택 안함, 1:오프라인, 2:크라임씬, 3:온라인/미정발, 4:우즈/리얼월드
     */
    category?: number | string | null;
    ownerNote?: string[] | string | null;
    thumbnail?: string | null;
    description?: string | null;
}

const GameCategoryCode = {
    NONE: 0,
    OFFLINE: 1,      // 오프라인
    CRIME_SCENE: 2,  // 크라임씬
    ONLINE: 3,       // 온라인/미정발
    WOODS_REAL: 4,   // 우즈/리얼월드
} as const;

type GameCategoryCodeValue = (typeof GameCategoryCode)[keyof typeof GameCategoryCode];

const CODE_TO_LABEL: Record<GameCategoryCodeValue, string | null> = {
    [GameCategoryCode.NONE]: null,
    [GameCategoryCode.OFFLINE]: "오프라인",
    [GameCategoryCode.CRIME_SCENE]: "크라임씬",
    [GameCategoryCode.ONLINE]: "온라인/미정발",
    [GameCategoryCode.WOODS_REAL]: "우즈/리얼월드",
};

function normalizeGameCategory(input: unknown): string | null {
    if (input === null || input === undefined) return null;

    if (typeof input === "number") {
        if (input === GameCategoryCode.NONE) return null;
        const label = CODE_TO_LABEL[input as GameCategoryCodeValue];
        if (!label) {
            throw new Error("category는 0~4 중 하나여야 합니다.");
        }
        return label;
    }

    const raw = String(input).trim();
    if (!raw) return null;

    if (/^\d+$/.test(raw)) {
        const code = Number(raw) as GameCategoryCodeValue;
        if (code === GameCategoryCode.NONE) return null;
        const label = CODE_TO_LABEL[code];
        if (!label) throw new Error("category는 0~4 중 하나여야 합니다.");
        return label;
    }

    const sanitizedLabel = sanitizeText(raw);
    if (!sanitizedLabel) return null;
    if (!Object.values(CODE_TO_LABEL).includes(sanitizedLabel)) {
        throw new Error("category 값이 올바르지 않습니다.");
    }
    return sanitizedLabel;
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
                    const sanitizedName = sanitizeText(value as string | null);
                    if (!sanitizedName) {
                        throw new Error("name이 유효하지 않습니다.");
                    }
                    updateData[key] = sanitizedName;
                    break;
                case "company":
                case "series":
                case "description":
                case "thumbnail":
                    updateData[key] = sanitizeText(value as string | null);
                    break;
                case "category":
                    updateData[key] = normalizeGameCategory(value);
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
