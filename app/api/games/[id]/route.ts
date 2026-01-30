import { deleteGame, getGameById, updateGame } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const result = await getGameById(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/games/[id]");
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const result = await updateGame(params.id, body);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "PUT /api/games/[id]");
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const result = await deleteGame(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "DELETE /api/games/[id]");
    }
}
