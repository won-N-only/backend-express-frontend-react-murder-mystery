import { createComment, getCommentsByGameId } from "@app/api/_handlers";
import { handleApiError } from "@app/api/_lib/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const result = await getCommentsByGameId(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error, "GET /api/games/[id]/comments");
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const body = await req.json();
        const { authorId, authorName, content, parentId } = body as {
            authorId?: string;
            authorName?: string;
            content?: string;
            parentId?: string | null;
        };

        if (!authorId || !authorName || !content || typeof content !== "string" || !content.trim()) {
            return NextResponse.json(
                { error: "authorId, authorName, content(비어있지 않음)는 필수입니다." },
                { status: 400 },
            );
        }

        const result = await createComment(params.id, {
            authorId,
            authorName,
            content,
            parentId: parentId ?? null,
        });
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return handleApiError(error, "POST /api/games/[id]/comments");
    }
}
