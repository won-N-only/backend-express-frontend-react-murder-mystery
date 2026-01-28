import { NextRequest, NextResponse } from "next/server";
import { getGameById, updateGame, deleteGame } from "../../../../lib/repositories/gameRepository";
import { listCompletionsForGame } from "../../../../lib/repositories/completionRepository";

interface RouteParams {
    params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const game = await getGameById(params.id);
        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }
        const completions = await listCompletionsForGame(params.id);
        return NextResponse.json({ game, completions });
    } catch (error) {
        console.error("GET /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const updated = await updateGame(params.id, body);
        if (!updated) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }
        return NextResponse.json({ game: updated });
    } catch (error) {
        console.error("PUT /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const ok = await deleteGame(params.id);
        if (!ok) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
    }
}

