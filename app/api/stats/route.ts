import { NextRequest, NextResponse } from "next/server";
import { getPlayerStats, getGameCompletionStats, getCompanyStats } from "../../../lib/services/statsService";

export async function GET(req: NextRequest) {
    try {
        const type = req.nextUrl.searchParams.get("type") ?? "all";

        const result: any = {};

        if (type === "all" || type === "players") {
            result.players = await getPlayerStats();
        }
        if (type === "all" || type === "games") {
            result.games = await getGameCompletionStats();
        }
        if (type === "all" || type === "companies") {
            result.companies = await getCompanyStats();
        }

        return NextResponse.json({ stats: result });
    } catch (error) {
        console.error("GET /api/stats error", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

