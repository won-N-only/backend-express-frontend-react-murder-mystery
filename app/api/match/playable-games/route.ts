import { getPlayableGames } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const playerIdsParam = searchParams.get("playerIds"); // playerIds=id1,id2,id3

        if (!playerIdsParam) {
            return NextResponse.json({ error: "playerIds는 필수입니다." }, { status: 400 });
        }

        const playerIds = playerIdsParam.split(",");
        const result = await getPlayableGames(playerIds);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/match/playable-games");
    }
}
