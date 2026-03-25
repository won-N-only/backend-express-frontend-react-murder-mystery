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
    category?: string | null;
}

export async function getGamesList(query: GetGamesQuery) {
    const { minPlayers: minPlayersParam, maxPlayers: maxPlayersParam, category: categoryParam } = query;
    const normalizedCategory = categoryParam ? String(categoryParam).trim() : "";
    const category = normalizedCategory ? normalizedCategory : null;
    let games;
    if (minPlayersParam) {
        const min = parseInt(minPlayersParam, 10);
        const max = maxPlayersParam ? parseInt(maxPlayersParam, 10) : undefined;
        const useCase = getGetGamesByPlayerCountUseCase();
        games = await useCase.execute(min, max, category);
    } else {
        const useCase = getGetGamesUseCase();
        games = await useCase.execute(category);
    }
    return { games: games.map(toGameDto) };
}

export interface CreateGameBody {
    name: string;
    minPlayers?: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
    /**
     * 게임 카테고리 코드 (0~4)
     * 0: 선택 안함, 1:정발, 2:미정발, 3:온라인, 4:크라임씬
     */
    category?: number | string | null;
    thumbnail?: string | null;
    description?: string | null;
    ownerNote?: string[] | string | null;
}

const GameCategoryCode = {
    NONE: 0,
    RELEASED: 1, // 정발
    UNRELEASED: 2, // 미정발
    ONLINE: 3,
    CRIME_SCENE: 4, // 크라임씬
} as const;

type GameCategoryCodeValue = (typeof GameCategoryCode)[keyof typeof GameCategoryCode];

const CODE_TO_LABEL: Record<GameCategoryCodeValue, string | null> = {
    [GameCategoryCode.NONE]: null,
    [GameCategoryCode.RELEASED]: "정발",
    [GameCategoryCode.UNRELEASED]: "미정발",
    [GameCategoryCode.ONLINE]: "온라인",
    [GameCategoryCode.CRIME_SCENE]: "크라임씬",
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

    // numeric code
    if (/^\d+$/.test(raw)) {
        const code = Number(raw) as GameCategoryCodeValue;
        if (code === GameCategoryCode.NONE) return null;
        const label = CODE_TO_LABEL[code];
        if (!label) throw new Error("category는 0~4 중 하나여야 합니다.");
        return label;
    }

    // fallback: label string (기존 데이터 호환)
    const sanitizedLabel = sanitizeText(raw);
    if (!sanitizedLabel) return null;
    const normalizedLabel = sanitizedLabel === "크씬" ? "크라임씬" : sanitizedLabel;
    if (!Object.values(CODE_TO_LABEL).includes(normalizedLabel)) {
        throw new Error("category 값이 올바르지 않습니다.");
    }
    return normalizedLabel;
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

    const normalizedCategory = normalizeGameCategory(body.category);

    const created = await useCase.execute({
        name: sanitizedName,
        minPlayers: Number(body.minPlayers) ?? 2,
        maxPlayers: body.maxPlayers != null ? Number(body.maxPlayers) || null : null,
        company: sanitizeText(body.company),
        series: sanitizeText(body.series),
        category: normalizedCategory,
        thumbnail: sanitizeText(body.thumbnail),
        description: sanitizeText(body.description),
        ownerNote: sanitizeTextArray(ownerNoteArray as string[]),
    });
    return { game: toGameDto(created) };
}
