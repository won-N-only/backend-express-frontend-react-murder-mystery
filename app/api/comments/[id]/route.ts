import { deleteComment } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const result = await deleteComment(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "DELETE /api/comments/[id]");
    }
}
