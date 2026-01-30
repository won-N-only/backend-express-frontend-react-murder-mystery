import { CommentNotFoundError } from "@comment/domain/errors/CommentNotFoundError";
import { GameNotFoundError } from "@game/domain/errors/GameNotFoundError";
import { NextResponse } from "next/server";

/**
 * API 레이어에서 도메인/유스케이스 예외를 HTTP 응답으로 변환합니다.
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
    if (error instanceof GameNotFoundError) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    if (error instanceof CommentNotFoundError) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    const message = context ? `${context} error` : "Internal server error";
    console.error(message, error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
}
