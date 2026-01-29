"use client";

import CompletionStatusButtons from "@app/components/common/CompletionStatusButtons";
import GameInfo from "@app/components/pages/games/GameInfo";
import { fetcher } from "@app/lib/fetcher";
import type { Game, Player } from "@app/types";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
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

    const completionMap = new Map<string, CompletionStatus>(
        completions.map((c: any) => [c.playerId as string, c.status as CompletionStatus]),
    );

    const updateStatus = async (playerId: string, status: CompletionStatus) => {
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
                <div className="sticky top-0 bg-head-white z-10 p-6 border-b border-head-gray-200 flex-shrink-0">
                    <div className="flex items-start justify-between">
                        {isLoadingGame ? (
                            <div className="text-head-gray-500">로딩 중...</div>
                        ) : game ? (
                            <GameInfo game={game} />
                        ) : null}
                        <button
                            onClick={onClose}
                            className="text-head-gray-500 hover:text-head-gray-800 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {game && (
                        <section className="space-y-4">
                            <h2 className="font-semibold text-head-gray-800">참가자별 완료 상태</h2>
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
                                                    onStatusChange={(s) => updateStatus(p._id, s)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
