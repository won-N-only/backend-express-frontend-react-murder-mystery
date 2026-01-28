import { NextRequest, NextResponse } from "next/server";
import { listGames, createGame, listGamesByPlayerCount } from "../../../lib/repositories/gameRepository";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const minPlayersParam = searchParams.get("minPlayers");
        const maxPlayersParam = searchParams.get("maxPlayers");

        let games;
        if (minPlayersParam) {
            const min = parseInt(minPlayersParam, 10);
            const max = maxPlayersParam ? parseInt(maxPlayersParam, 10) : undefined;
            games = await listGamesByPlayerCount(min, max);
        } else {
            games = await listGames();
        }

        return NextResponse.json({ games });
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

        const game = await createGame({
            orderNumber,
            name,
            minPlayers,
            maxPlayers: maxPlayers ?? null,
            company: company ?? null,
            series: series ?? null,
            ownerNote: ownerNote ?? null,
        });

        return NextResponse.json({ game }, { status: 201 });
    } catch (error) {
        console.error("POST /api/games error", error);
        return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
    }
}

