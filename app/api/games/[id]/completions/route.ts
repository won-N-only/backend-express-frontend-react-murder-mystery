import { deleteCompletion, upsertCompletion } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const { playerId, status } = body as { playerId: string; status: number };

        if (!playerId || status === undefined || status === null) {
            return NextResponse.json(
                { error: "playerId, status는 필수입니다." },
                { status: 400 },
            );
        }
        if (status !== CompletionStatus.DONE && status !== CompletionStatus.NOT_DONE) {
            return NextResponse.json(
                { error: `유효하지 않은 status 값입니다: ${status}` },
                { status: 400 },
            );
        }

        const result = await upsertCompletion(params.id, { playerId, status });
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "POST /api/games/[id]/completions");
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const playerId = req.nextUrl.searchParams.get("playerId");
        if (!playerId) {
            return NextResponse.json({ error: "playerId는 필수입니다." }, { status: 400 });
        }
        const result = await deleteCompletion(params.id, playerId);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "DELETE /api/games/[id]/completions");
    }
}
