import {
    getDeleteGameUseCase,
    getGetCompletionsByGameIdUseCase,
    getGetGameByIdUseCase,
    getUpdateGameUseCase,
} from "@shared/infrastructure/di/container";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const getGameByIdUseCase = getGetGameByIdUseCase();
        const getCompletionsUseCase = getGetCompletionsByGameIdUseCase();

        // 게임 정보와 완료 상태를 병렬로 가져오기
        const [game, completions] = await Promise.all([
            getGameByIdUseCase.execute(params.id),
            getCompletionsUseCase.execute(params.id),
        ]);

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const gameDto = {
            _id: game.id,
            orderNumber: game.orderNumber,
            name: game.name,
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            company: game.company,
            series: game.series,
            ownerNote: game.ownerNote,
            thumbnail: game.thumbnail,
            description: game.description,
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

        const updateGameUseCase = getUpdateGameUseCase();
        const updateData: any = { ...rest };
        if (ownerNote !== undefined) {
            updateData.ownerNote = ownerNoteArray;
        }
        if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail ?? null;
        if (body.description !== undefined) updateData.description = body.description ?? null;
        const updated = await updateGameUseCase.execute(params.id, updateData);
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
            thumbnail: updated.thumbnail,
            description: updated.description,
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
        const deleteGameUseCase = getDeleteGameUseCase();
        const ok = await deleteGameUseCase.execute(params.id);
        if (!ok) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/games/[id] error", error);
        return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
    }
}

