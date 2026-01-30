import { getStats } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = (searchParams.get("type") as "all" | "players" | "games" | "companies" | null) ?? "all";
        const result = await getStats(type);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/stats");
    }
}
