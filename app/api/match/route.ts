import { NextRequest, NextResponse } from "next/server";
import { findMatches } from "../../../lib/services/matchService";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { playerIds, playerCount } = body as { playerIds: string[]; playerCount: number };

        if (!Array.isArray(playerIds) || playerIds.length === 0) {
            return NextResponse.json({ error: "playerIds 배열이 필요합니다." }, { status: 400 });
        }
        if (!playerCount || playerCount < 2) {
            return NextResponse.json({ error: "playerCount는 2 이상이어야 합니다." }, { status: 400 });
        }

        const matches = await findMatches({ playerIds, playerCount });
        return NextResponse.json({ matches });
    } catch (error) {
        console.error("POST /api/match error", error);
        return NextResponse.json({ error: "Failed to find matches" }, { status: 500 });
    }
}

