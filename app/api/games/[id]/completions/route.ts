import { NextRequest, NextResponse } from "next/server";
import { CompletionStatus } from "../../../../../src/domain/valueObjects/CompletionStatus";
import { getCompletionRepository } from "../../../../../src/infrastructure/di/container";

interface RouteParams {
    params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const { playerId, status } = body as { playerId: string; status: CompletionStatus };

        if (!playerId || !status) {
            return NextResponse.json({ error: "playerId, status는 필수입니다." }, { status: 400 });
        }

        const completionRepository = getCompletionRepository();
        const completion = await completionRepository.upsert(params.id, playerId, status);
        const completionDto = {
            _id: completion.id,
            gameId: completion.gameId,
            playerId: completion.playerId,
            status: completion.status,
            completedAt: completion.completedAt,
        };
        return NextResponse.json({ completion: completionDto });
    } catch (error) {
        console.error("POST /api/games/[id]/completions error", error);
        return NextResponse.json({ error: "Failed to update completion" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const playerId = req.nextUrl.searchParams.get("playerId");
        if (!playerId) {
            return NextResponse.json({ error: "playerId는 필수입니다." }, { status: 400 });
        }
        const completionRepository = getCompletionRepository();
        const ok = await completionRepository.delete(params.id, playerId);
        return NextResponse.json({ success: ok });
    } catch (error) {
        console.error("DELETE /api/games/[id]/completions error", error);
        return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
    }
}

