import { getGetPlayersUseCase, getUpsertPlayerUseCase } from "@shared/infrastructure/di/container";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const getPlayersUseCase = getGetPlayersUseCase();
        const players = await getPlayersUseCase.execute();
        const playersDto = players.map((p) => ({
            _id: p.id,
            name: p.name,
            lastUpdated: p.lastUpdated,
            createdAt: p.createdAt,
        }));
        return NextResponse.json({ players: playersDto });
    } catch (error) {
        console.error("GET /api/players error", error);
        return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body as { name: string };
        if (!name) {
            return NextResponse.json({ error: "name은 필수입니다." }, { status: 400 });
        }
        const upsertPlayerUseCase = getUpsertPlayerUseCase();
        const player = await upsertPlayerUseCase.execute(name);
        const playerDto = {
            _id: player.id,
            name: player.name,
            lastUpdated: player.lastUpdated,
            createdAt: player.createdAt,
        };
        return NextResponse.json({ player: playerDto }, { status: 201 });
    } catch (error) {
        console.error("POST /api/players error", error);
        return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
    }
}

