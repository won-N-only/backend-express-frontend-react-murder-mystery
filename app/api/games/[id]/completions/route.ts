import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import {
    getDeleteCompletionUseCase,
    getUpsertCompletionUseCase,
} from "@shared/infrastructure/di/container";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const { playerId, status } = body as { playerId: string; status: CompletionStatus };

        if (!playerId || status === undefined || status === null) {
            return NextResponse.json({ error: "playerId, status는 필수입니다." }, { status: 400 });
        }

        // status가 유효한 CompletionStatus 값인지 확인
        if (status !== CompletionStatus.DONE && status !== CompletionStatus.NOT_DONE) {
            return NextResponse.json(
                { error: `유효하지 않은 status 값입니다: ${status}` },
                { status: 400 },
            );
        }

        const upsertCompletionUseCase = getUpsertCompletionUseCase();
        const completion = await upsertCompletionUseCase.execute(params.id, playerId, status);
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
        const deleteCompletionUseCase = getDeleteCompletionUseCase();
        const ok = await deleteCompletionUseCase.execute(params.id, playerId);
        return NextResponse.json({ success: ok });
    } catch (error) {
        console.error("DELETE /api/games/[id]/completions error", error);
        return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
    }
}

