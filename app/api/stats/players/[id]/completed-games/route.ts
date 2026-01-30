import { getCompletedGamesByPlayerId } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const result = await getCompletedGamesByPlayerId(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/stats/players/[id]/completed-games");
    }
}
