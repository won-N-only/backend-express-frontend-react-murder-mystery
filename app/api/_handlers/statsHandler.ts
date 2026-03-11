import {
    getGetCompanyStatsUseCase,
    getGetGameCompletionStatsUseCase,
    getGetPlayerStatsUseCase,
} from "@shared/infrastructure/di/container";

export type StatsType = "all" | "players" | "games" | "companies";

const STATS_CACHE_TTL_MS = 300_000_000_000;

type StatsCacheEntry = {
    data: { stats: Record<string, unknown> };
    expiresAt: number;
};

const statsCache = new Map<StatsType, StatsCacheEntry>();

export async function getStats(type: StatsType) {
    const now = Date.now();
    const cached = statsCache.get(type);

    if (cached && cached.expiresAt > now) {
        return cached.data;
    }

    const result: Record<string, unknown> = {};
    const promises: Promise<void>[] = [];

    if (type === "all" || type === "players") {
        const useCase = getGetPlayerStatsUseCase();
        promises.push(
            useCase.execute().then((players) => {
                result.players = players;
            }),
        );
    }
    if (type === "all" || type === "games") {
        const useCase = getGetGameCompletionStatsUseCase();
        promises.push(
            useCase.execute().then((games) => {
                result.games = games;
            }),
        );
    }
    if (type === "all" || type === "companies") {
        const useCase = getGetCompanyStatsUseCase();
        promises.push(
            useCase.execute().then((companies) => {
                result.companies = companies;
            }),
        );
    }

    await Promise.all(promises);

    const data = { stats: result };
    statsCache.set(type, {
        data,
        expiresAt: now + STATS_CACHE_TTL_MS,
    });

    return data;
}
