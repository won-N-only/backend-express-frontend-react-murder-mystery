"use client";

import CompletionStatusButtons from "@app/components/common/CompletionStatusButtons";
import GameCommentsSection from "@app/components/pages/games/GameCommentsSection";
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
                className="bg-head-white rounded-2xl shadow-lg max-w-content w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {isLoadingGame ? (
                    <div className="flex items-center justify-center p-8">
                        <span className="text-head-text">로딩 중...</span>
                    </div>
                ) : game ? (
                    <>
                        {/* 헤더 - 상단 어두운 회색 바 */}
                        <div className="bg-head-text px-6 py-2 flex-shrink-0">
                            <span className="text-sm text-white font-semibold">
                                #{game.orderNumber}
                            </span>
                        </div>

                        {/* 게임 정보 헤더 */}
                        <div className="bg-head-white px-6 py-4 border-b border-head-border flex-shrink-0">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-head-text mb-1">
                                        {game.name}
                                    </h2>
                                    <div className="text-sm text-head-text">
                                        <span>
                                            {game.minPlayers}
                                            {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                                        </span>
                                    </div>
                                    {(game.company || game.series) && (
                                        <div className="text-sm text-head-text mt-1">
                                            {game.company && <span>{game.company}</span>}
                                            {game.company && game.series && <span> : </span>}
                                            {game.series && <span>{game.series}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href={`/games/${gameId}/edit`}
                                        className="bg-head-text text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        게임 수정
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="text-head-text hover:text-head-text/80 text-2xl leading-none font-normal"
                                        aria-label="닫기"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 overflow-y-auto bg-head-main p-6 space-y-6">
                            {/* 댓글 섹션 */}
                            <GameCommentsSection gameId={gameId} />

                            {/* 대머리 완료 여부 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold text-head-text">
                                    대머리 완료 여부
                                </h2>
                                <div className="grid grid-cols-4 gap-3">
                                    {players.map((p) => {
                                        const status =
                                            completionMap.get(p._id) ?? CompletionStatus.NOT_DONE;
                                        return (
                                            <div key={p._id} className="flex flex-col gap-2">
                                                <span className="text-sm font-medium text-center text-head-text">
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
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center p-8">
                        <span className="text-head-text">게임을 찾을 수 없습니다.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
