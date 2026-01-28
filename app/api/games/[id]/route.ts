import { NextRequest, NextResponse } from "next/server";
import { getCompletionRepository, getGameRepository } from "../../../../src/infrastructure/di/container";

interface RouteParams {
    params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const gameRepository = getGameRepository();
        const completionRepository = getCompletionRepository();
        const game = await gameRepository.findById(params.id);
        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }
        const completions = await completionRepository.findByGameId(params.id);

        const gameDto = {
            _id: game.id,
            orderNumber: game.orderNumber,
            name: game.name,
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            company: game.company,
            series: game.series,
            ownerNote: game.ownerNote,
            createdAt: game.createdAt,
            updatedAt: game.updatedAt,
        };

        const completionsDto = completions.map((c) => ({
            _id: c.id,
            gameId: c.gameId,
            playerId: c.playerId,
            status: c.status,
            completedAt: c.completedAt,
        }));

        return NextResponse.json({ game: gameDto, completions: completionsDto });
    } catch (error) {
        console.error("GET /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const { ownerNote, ...rest } = body;

        // ownerNote를 string[]로 변환 (배열이 아니면 배열로, null/undefined면 null)
        let ownerNoteArray: string[] | null = null;
        if (ownerNote !== undefined) {
            if (ownerNote === null) {
                ownerNoteArray = null;
            } else if (Array.isArray(ownerNote)) {
                ownerNoteArray = ownerNote.filter((s) => typeof s === "string" && s.trim().length > 0);
                ownerNoteArray = ownerNoteArray.length > 0 ? ownerNoteArray : null;
            } else if (typeof ownerNote === "string" && ownerNote.trim().length > 0) {
                // 단일 문자열인 경우 쉼표로 구분하여 배열로 변환
                ownerNoteArray = ownerNote.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
                ownerNoteArray = ownerNoteArray.length > 0 ? ownerNoteArray : null;
            } else {
                ownerNoteArray = null;
            }
        }

        const gameRepository = getGameRepository();
        const updateData: any = { ...rest };
        if (ownerNote !== undefined) {
            updateData.ownerNote = ownerNoteArray;
        }
        const updated = await gameRepository.update(params.id, updateData);
        if (!updated) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const gameDto = {
            _id: updated.id,
            orderNumber: updated.orderNumber,
            name: updated.name,
            minPlayers: updated.minPlayers,
            maxPlayers: updated.maxPlayers,
            company: updated.company,
            series: updated.series,
            ownerNote: updated.ownerNote,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };

        return NextResponse.json({ game: gameDto });
    } catch (error) {
        console.error("PUT /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const gameRepository = getGameRepository();
        const ok = await gameRepository.delete(params.id);
        if (!ok) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
    }
}

