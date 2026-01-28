import {
    getCreateGameUseCase,
    getGetGamesByPlayerCountUseCase,
    getGetGamesUseCase,
} from "@/src/common/infrastructure/di/container";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const minPlayersParam = searchParams.get("minPlayers");
        const maxPlayersParam = searchParams.get("maxPlayers");

        let games;
        if (minPlayersParam) {
            const min = parseInt(minPlayersParam, 10);
            const max = maxPlayersParam ? parseInt(maxPlayersParam, 10) : undefined;
            const useCase = getGetGamesByPlayerCountUseCase();
            games = await useCase.execute(min, max);
        } else {
            const useCase = getGetGamesUseCase();
            games = await useCase.execute();
        }

        // 엔티티를 DTO로 변환
        const gamesDto = games.map((game) => ({
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
        }));

        return NextResponse.json({ games: gamesDto });
    } catch (error) {
        console.error("GET /api/games error", error);
        return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderNumber, name, minPlayers, maxPlayers, company, series, ownerNote } = body;

        if (!name || !minPlayers || !orderNumber) {
            return NextResponse.json(
                { error: "orderNumber, name, minPlayers는 필수입니다." },
                { status: 400 },
            );
        }

        // ownerNote를 string[]로 변환 (배열이 아니면 배열로, null/undefined면 null)
        let ownerNoteArray: string[] | null = null;
        if (ownerNote != null) {
            if (Array.isArray(ownerNote)) {
                ownerNoteArray = ownerNote.filter((s) => typeof s === "string" && s.trim().length > 0);
                ownerNoteArray = ownerNoteArray.length > 0 ? ownerNoteArray : null;
            } else if (typeof ownerNote === "string" && ownerNote.trim().length > 0) {
                // 단일 문자열인 경우 쉼표로 구분하여 배열로 변환
                ownerNoteArray = ownerNote.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
                ownerNoteArray = ownerNoteArray.length > 0 ? ownerNoteArray : null;
            }
        }

        const createGameUseCase = getCreateGameUseCase();
        const createdGame = await createGameUseCase.execute({
            orderNumber,
            name,
            minPlayers,
            maxPlayers: maxPlayers ?? null,
            company: company ?? null,
            series: series ?? null,
            ownerNote: ownerNoteArray,
        });

        const gameDto = {
            _id: createdGame.id,
            orderNumber: createdGame.orderNumber,
            name: createdGame.name,
            minPlayers: createdGame.minPlayers,
            maxPlayers: createdGame.maxPlayers,
            company: createdGame.company,
            series: createdGame.series,
            ownerNote: createdGame.ownerNote,
            createdAt: createdGame.createdAt,
            updatedAt: createdGame.updatedAt,
        };

        return NextResponse.json({ game: gameDto }, { status: 201 });
    } catch (error) {
        console.error("POST /api/games error", error);
        return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
    }
}

