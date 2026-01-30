import { findMatches } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            playerIds,
            playerCount,
            useCombination,
            excludePartySeries,
            excludeSinglePlayer,
            excludeTwoPlayer,
            numGroups,
        } = body as {
            playerIds: string[];
            playerCount?: number;
            useCombination?: boolean;
            excludePartySeries?: boolean;
            excludeSinglePlayer?: boolean;
            excludeTwoPlayer?: boolean;
            numGroups?: number;
        };

        if (!Array.isArray(playerIds) || playerIds.length === 0) {
            return NextResponse.json({ error: "playerIds 배열이 필요합니다." }, { status: 400 });
        }
        if (useCombination && playerIds.length < 2) {
            return NextResponse.json(
                { error: "조합 매칭은 최소 2명 이상이어야 합니다." },
                { status: 400 },
            );
        }
        if (!useCombination && (!playerCount || playerCount < 2)) {
            return NextResponse.json(
                { error: "playerCount는 2 이상이어야 합니다." },
                { status: 400 },
            );
        }

        const result = await findMatches({
            playerIds,
            playerCount,
            useCombination,
            excludePartySeries,
            excludeSinglePlayer,
            excludeTwoPlayer,
            numGroups,
        });
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "POST /api/match");
    }
}
