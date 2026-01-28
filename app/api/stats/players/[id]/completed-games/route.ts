import { getGetCompletedGamesByPlayerIdUseCase } from "@shared/infrastructure/di/container";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const useCase = getGetCompletedGamesByPlayerIdUseCase();
        const completedGames = await useCase.execute(params.id);

        return NextResponse.json({ completedGames });
    } catch (error) {
        console.error("GET /api/stats/players/[id]/completed-games error", error);
        return NextResponse.json({ error: "Failed to fetch completed games" }, { status: 500 });
    }
}
