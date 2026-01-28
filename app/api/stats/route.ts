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

        if (type === "all" || type === "players") {
            const getPlayerStatsUseCase = getGetPlayerStatsUseCase();
            result.players = await getPlayerStatsUseCase.execute();
        }
        if (type === "all" || type === "games") {
            const getGameCompletionStatsUseCase = getGetGameCompletionStatsUseCase();
            result.games = await getGameCompletionStatsUseCase.execute();
        }
        if (type === "all" || type === "companies") {
            const getCompanyStatsUseCase = getGetCompanyStatsUseCase();
            result.companies = await getCompanyStatsUseCase.execute();
        }

        return NextResponse.json({ stats: result });
    } catch (error) {
        console.error("GET /api/stats error", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

