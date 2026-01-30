import {
    getGetCompanyStatsUseCase,
    getGetGameCompletionStatsUseCase,
    getGetPlayerStatsUseCase,
} from "@shared/infrastructure/di/container";

export type StatsType = "all" | "players" | "games" | "companies";

export async function getStats(type: StatsType) {
    const result: Record<string, unknown> = {};
    const promises: Promise<void>[] = [];

    if (type === "all" || type === "players") {
        const useCase = getGetPlayerStatsUseCase();
        promises.push(useCase.execute().then((players) => { result.players = players; }));
    }
    if (type === "all" || type === "games") {
        const useCase = getGetGameCompletionStatsUseCase();
        promises.push(useCase.execute().then((games) => { result.games = games; }));
    }
    if (type === "all" || type === "companies") {
        const useCase = getGetCompanyStatsUseCase();
        promises.push(useCase.execute().then((companies) => { result.companies = companies; }));
    }

    await Promise.all(promises);
    return { stats: result };
}
