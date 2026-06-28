import { CommentNotFoundError } from "@comment/domain/errors/CommentNotFoundError";
import { GameNotFoundError } from "@game/domain/errors/GameNotFoundError";
import { ConflictError } from "@shared/domain/errors/ConflictError";
import { ForbiddenError } from "@shared/domain/errors/ForbiddenError";
import { NextResponse } from "next/server";

export function handleApiError(error: unknown, context?: string): NextResponse {
    if (error instanceof GameNotFoundError) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    if (error instanceof CommentNotFoundError) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (error instanceof ForbiddenError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof ConflictError) {
        return NextResponse.json({ error: error.message }, { status: 409 });
    }
    const message = context ? `${context} error` : "Internal server error";
    console.error(message, error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
}
