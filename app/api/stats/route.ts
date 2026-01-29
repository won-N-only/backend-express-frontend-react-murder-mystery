import {
    getGetCompanyStatsUseCase,
    getGetGameCompletionStatsUseCase,
    getGetPlayerStatsUseCase,
} from "@shared/infrastructure/di/container";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = (searchParams.get("type") as string | null) ?? "all";

        const result: any = {};

        // 병렬 실행으로 성능 개선
        const promises: Promise<any>[] = [];

        if (type === "all" || type === "players") {
            const getPlayerStatsUseCase = getGetPlayerStatsUseCase();
            promises.push(
                getPlayerStatsUseCase.execute().then((players) => {
                    result.players = players;
                }),
            );
        }
        if (type === "all" || type === "games") {
            const getGameCompletionStatsUseCase = getGetGameCompletionStatsUseCase();
            promises.push(
                getGameCompletionStatsUseCase.execute().then((games) => {
                    result.games = games;
                }),
            );
        }
        if (type === "all" || type === "companies") {
            const getCompanyStatsUseCase = getGetCompanyStatsUseCase();
            promises.push(
                getCompanyStatsUseCase.execute().then((companies) => {
                    result.companies = companies;
                }),
            );
        }

        await Promise.all(promises);

        return NextResponse.json({ stats: result });
    } catch (error) {
        console.error("GET /api/stats error", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

