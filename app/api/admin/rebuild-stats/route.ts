import { handleApiError } from "@app/api/_lib/errorHandler";
import { resolveRebuildStatSnapshotsUseCase } from "@shared/infrastructure/di/container";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** 기존 completion 데이터로부터 statSnapshots를 전체 재구축합니다. 최초 배포 후 1회 호출 필요. */
export async function POST(req: NextRequest) {
    try {
        const secret = req.headers.get("x-admin-secret");
        if (secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await resolveRebuildStatSnapshotsUseCase().execute();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        return handleApiError(error, "POST /api/admin/rebuild-stats");
    }
}
