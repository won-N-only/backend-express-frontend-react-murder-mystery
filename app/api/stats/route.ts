import { NextResponse } from "next/server";
import { getStatsService } from "../../../src/infrastructure/di/container";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = (searchParams.get("type") as string | null) ?? "all";

        const result: any = {};

        const statsService = getStatsService();

        if (type === "all" || type === "players") {
            result.players = await statsService.getPlayerStats();
        }
        if (type === "all" || type === "games") {
            result.games = await statsService.getGameCompletionStats();
        }
        if (type === "all" || type === "companies") {
            result.companies = await statsService.getCompanyStats();
        }

        return NextResponse.json({ stats: result });
    } catch (error) {
        console.error("GET /api/stats error", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

