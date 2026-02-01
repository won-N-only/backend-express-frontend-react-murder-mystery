import { toCompletionDto } from "@app/api/_mappers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { upsertCompletion } from "@app/api/_handlers/gameCompletionsHandler";
import { getGetCompletionsByGameIdUseCase } from "@shared/infrastructure/di/container";
import { NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function GET(_req: Request, { params }: RouteParams) {
    try {
        const getCompletionsUseCase = getGetCompletionsByGameIdUseCase();
        const completions = await getCompletionsUseCase.execute(params.id);
        return NextResponse.json({
            completions: completions.map(toCompletionDto),
        });
    } catch (error) {
        return handleApiError(error, "GET /api/games/[id]/completions");
    }
}

export async function POST(req: Request, { params }: RouteParams) {
    try {
        const body = await req.json();
        const result = await upsertCompletion(params.id, body);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "POST /api/games/[id]/completions");
    }
}
