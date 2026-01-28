import { NextRequest, NextResponse } from "next/server";
import { upsertCompletion, deleteCompletion } from "../../../../../lib/repositories/completionRepository";
import { CompletionStatus } from "../../../../../types/domain";

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

        const completion = await upsertCompletion(params.id, playerId, status);
        return NextResponse.json({ completion });
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
        const ok = await deleteCompletion(params.id, playerId);
        return NextResponse.json({ success: ok });
    } catch (error) {
        console.error("DELETE /api/games/[id]/completions error", error);
        return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
    }
}

