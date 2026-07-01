import { createGame, getGamesList } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const result = await getGamesList({
            minPlayers: searchParams.get("minPlayers"),
            maxPlayers: searchParams.get("maxPlayers"),
            category: searchParams.get("category"),
        });
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/games");
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, minPlayers, maxPlayers, company, series, category, thumbnail, description, owners } = body;

        if (!name || minPlayers == null) {
            return NextResponse.json(
                { error: "name, minPlayers는 필수입니다." },
                { status: 400 },
            );
        }

        const result = await createGame({
            name,
            minPlayers,
            maxPlayers,
            company,
            series,
            category,
            thumbnail,
            description,
            owners,
        });
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return handleApiError(error, "POST /api/games");
    }
}
