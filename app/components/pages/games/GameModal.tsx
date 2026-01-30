"use client";

import CompletionStatusButtons from "@app/components/common/CompletionStatusButtons";
import GameCommentsSection from "@app/components/pages/games/GameCommentsSection";
import GameInfo from "@app/components/pages/games/GameInfo";
import { fetcher } from "@app/lib/fetcher";
import type { CompletionStatusValue, Game, Player } from "@app/types";
import { CompletionStatus } from "@app/types";
import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";

interface GameModalProps {
    gameId: string | null;
    onClose: () => void;
}

export default function GameModal({ gameId, onClose }: GameModalProps) {
    const {
        data,
        mutate,
        isLoading: isLoadingGame,
    } = useSWR(gameId ? `/api/games/${gameId}` : null, fetcher);
    const { data: playersData } = useSWR("/api/players", fetcher);

    const game: Game | undefined = data?.game;
    const completions = data?.completions ?? [];
    const players: Player[] = playersData?.players ?? [];

    const completionMap = new Map<string, CompletionStatusValue>(
        completions.map((c: { playerId: string; status: CompletionStatusValue }) => [
            c.playerId,
            c.status,
        ]),
    );

    const updateStatus = async (playerId: string, status: CompletionStatusValue) => {
        if (!gameId) return;
        try {
            const response = await fetch(`/api/games/${gameId}/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, status }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Failed to update status:", error);
                return;
            }

            mutate();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    useEffect(() => {
        if (gameId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [gameId]);

    if (!gameId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-head-white rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-head-white z-10 px-6 py-4 border-b border-head-gray-200 flex-shrink-0 flex items-center justify-between gap-3">
                    {isLoadingGame ? (
                        <span className="text-head-gray-500">로딩 중...</span>
                    ) : game ? (
                        <>
                            <h2 className="text-lg font-bold text-head-gray-800 truncate min-w-0 flex-1">
                                {game.name}
                            </h2>
                            <Link
                                href={`/games/${gameId}/edit`}
                                className="shrink-0 btn-primary px-3 py-1.5 text-sm"
                            >
                                게임 수정
                            </Link>
                        </>
                    ) : (
                        <span />
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 text-head-gray-500 hover:text-head-gray-800 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {game && (
                        <>
                            {/* 1. 썸네일 · 시놉시스 */}
                            <GameInfo game={game} />

                            {/* 2. 댓글 */}
                            <GameCommentsSection gameId={gameId} />

                            {/* 3. 남들한 여부 */}
                            <section className="space-y-4">
                                <h2 className="font-semibold text-head-gray-800">남들한 여부</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {players.map((p) => {
                                        const status =
                                            completionMap.get(p._id) ?? CompletionStatus.NOT_DONE;
                                        return (
                                            <div
                                                key={p._id}
                                                className="flex flex-col gap-2 rounded-lg border border-head-gray-300 bg-head-white p-3 hover:shadow-md transition-shadow"
                                            >
                                                <span className="text-sm font-medium text-center text-head-gray-800">
                                                    {p.name}
                                                </span>
                                                <div className="flex justify-center">
                                                    <CompletionStatusButtons
                                                        currentStatus={status}
                                                        onStatusChange={(s) =>
                                                            updateStatus(p._id, s)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
