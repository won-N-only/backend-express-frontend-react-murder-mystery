import { createPlayer, getPlayers } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await getPlayers();
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/players");
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body as { name: string };
        if (!name) {
            return NextResponse.json({ error: "name은 필수입니다." }, { status: 400 });
        }
        const result = await createPlayer({ name });
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return handleApiError(error, "POST /api/players");
    }
}
