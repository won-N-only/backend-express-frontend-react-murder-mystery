import { toGameDto } from "@app/api/_mappers";
import { sanitizeText, sanitizeTextArray } from "@app/lib/sanitizer";
import { GameCategory } from "@game/domain/enums/GameCategory";
import {
    getCreateGameUseCase,
    resolveGamesByPlayerCountUseCase,
    resolveGamesUseCase,
} from "@shared/infrastructure/di/container";

export interface GetGamesQuery {
    minPlayers?: string | null;
    maxPlayers?: string | null;
    category?: string | null;
}

function parseCategory(raw: string | null | undefined): GameCategory | null {
    if (!raw) return null;
    const trimmed = raw.trim();
    return Object.values(GameCategory).includes(trimmed as GameCategory)
        ? (trimmed as GameCategory)
        : null;
}

export async function getGamesList(query: GetGamesQuery) {
    const { minPlayers: minPlayersParam, maxPlayers: maxPlayersParam, category: categoryParam } = query;
    const category = parseCategory(categoryParam);
    let games;
    if (minPlayersParam) {
        const min = parseInt(minPlayersParam, 10);
        const max = maxPlayersParam ? parseInt(maxPlayersParam, 10) : undefined;
        const useCase = resolveGamesByPlayerCountUseCase();
        games = await useCase.execute(min, max, category);
    } else {
        const useCase = resolveGamesUseCase();
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
     * 0: 선택 안함, 1:오프라인, 2:크라임씬, 3:온라인/미정발, 4:우즈/리얼월드
     */
    category?: number | string | null;
    thumbnail?: string | null;
    description?: string | null;
    owners?: string[] | null;
}

const GameCategoryCode = {
    NONE: 0,
    OFFLINE: 1,      // 오프라인
    CRIME_SCENE: 2,  // 크라임씬
    ONLINE: 3,       // 온라인/미정발
    WOODS_REAL: 4,   // 우즈/리얼월드
} as const;

type GameCategoryCodeValue = (typeof GameCategoryCode)[keyof typeof GameCategoryCode];

const CODE_TO_LABEL: Record<GameCategoryCodeValue, GameCategory | null> = {
    [GameCategoryCode.NONE]: null,
    [GameCategoryCode.OFFLINE]: GameCategory.Offline,
    [GameCategoryCode.CRIME_SCENE]: GameCategory.CrimeScene,
    [GameCategoryCode.ONLINE]: GameCategory.Online,
    [GameCategoryCode.WOODS_REAL]: GameCategory.WoodsReal,
};

function normalizeGameCategory(input: unknown): GameCategory | null {
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

    // fallback: label string
    const sanitizedLabel = sanitizeText(raw);
    if (!sanitizedLabel) return null;
    if (!Object.values(GameCategory).includes(sanitizedLabel as GameCategory)) {
        throw new Error("category 값이 올바르지 않습니다.");
    }
    return sanitizedLabel as GameCategory;
}

export async function createGame(body: CreateGameBody) {
    const useCase = getCreateGameUseCase();

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
        owners: sanitizeTextArray(body.owners as string[]),
    });
    return { game: toGameDto(created) };
}
