import { NextRequest, NextResponse } from "next/server";
import { listPlayers, upsertPlayer } from "../../../lib/repositories/playerRepository";

export async function GET() {
    try {
        const players = await listPlayers();
        return NextResponse.json({ players });
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
        const player = await upsertPlayer(name);
        return NextResponse.json({ player }, { status: 201 });
    } catch (error) {
        console.error("POST /api/players error", error);
        return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
    }
}

