"use client";

import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../lib/fetcher";
import type { Game } from "../types";

interface GameCheckModalProps {
    playerId: string | null;
    playerName: string | null;
    onClose: () => void;
}

interface CompletedGame {
    gameId: string;
    gameName: string;
    orderNumber: number;
    completedAt: Date | null;
}

export default function GameCheckModal({ playerId, playerName, onClose }: GameCheckModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingGameIds, setUpdatingGameIds] = useState<Set<string>>(new Set());

    const { data: gamesData, isLoading: isLoadingGames } = useSWR<{ games: Game[] }>(
        "/api/games",
        fetcher,
    );
    const { data: completedGamesData, isLoading: isLoadingCompleted } = useSWR<{
        completedGames: CompletedGame[];
    }>(playerId ? `/api/stats/players/${playerId}/completed-games` : null, fetcher);

    const games = gamesData?.games ?? [];
    const completedGames = completedGamesData?.completedGames ?? [];

    // 완료한 게임 ID Set 생성
    const completedGameIds = useMemo(
        () => new Set(completedGames.map((g) => g.gameId)),
        [completedGames],
    );

    // 검색 필터링된 게임 목록
    const filteredGames = useMemo(() => {
        if (!searchQuery.trim()) return games;
        const query = searchQuery.toLowerCase();
        return games.filter(
            (game) =>
                game.name.toLowerCase().includes(query) ||
                game.company?.toLowerCase().includes(query) ||
                game.series?.toLowerCase().includes(query),
        );
    }, [games, searchQuery]);

    const updateStatus = async (gameId: string, isCompleted: boolean) => {
        if (!playerId) return;

        // 로딩 상태 추가
        setUpdatingGameIds((prev) => new Set(prev).add(gameId));

        try {
            const status = isCompleted ? CompletionStatus.DONE : CompletionStatus.NOT_DONE;
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

            // SWR 캐시 무효화하여 데이터 재조회
            if (playerId) {
                mutate(`/api/stats/players/${playerId}/completed-games`);
                mutate("/api/stats");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            // 로딩 상태 제거
            setUpdatingGameIds((prev) => {
                const next = new Set(prev);
                next.delete(gameId);
                return next;
            });
        }
    };

    useEffect(() => {
        if (playerId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [playerId]);

    if (!playerId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-head-white rounded-2xl shadow-soft max-w-[720px] w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 및 검색 - sticky */}
                <div className="sticky top-0 bg-head-white z-10 p-6 space-y-4 border-b border-head-gray-200 flex-shrink-0">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-head-gray-800">
                                {playerName}님의 게임 체크
                            </h2>
                            <p className="text-sm text-head-gray-500 mt-1">
                                완료한 게임을 체크해주세요
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-head-gray-500 hover:text-head-gray-800 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* 검색 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="게임 이름, 제작사, 시리즈로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-head-gray-300 bg-head-white px-4 py-2.5 pr-10 text-head-gray-800 focus:outline-none focus:ring-2 focus:ring-head-blue focus:border-transparent"
                        />
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-head-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* 게임 목록 */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {isLoadingGames || isLoadingCompleted ? (
                        <div className="text-center py-8 text-head-gray-500">로딩 중...</div>
                    ) : filteredGames.length === 0 ? (
                        <div className="text-center py-8 text-head-gray-500">
                            {searchQuery ? "검색 결과가 없습니다." : "게임이 없습니다."}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredGames.map((game) => {
                                const isCompleted = completedGameIds.has(game._id);
                                const isUpdating = updatingGameIds.has(game._id);

                                return (
                                    <button
                                        key={game._id}
                                        type="button"
                                        onClick={() => updateStatus(game._id, !isCompleted)}
                                        disabled={isUpdating}
                                        className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                                            isCompleted
                                                ? "border-head-blue bg-head-blue/5 hover:bg-head-blue/10"
                                                : "border-head-gray-300 bg-head-white hover:shadow-md hover:border-head-blue"
                                        } ${isUpdating ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-head-gray-500 bg-head-gray-100 px-2 py-0.5 rounded">
                                                    #{game.orderNumber}
                                                </span>
                                                <span className="font-medium text-head-gray-800 truncate">
                                                    {game.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-head-gray-500">
                                                {game.company && (
                                                    <span className="truncate">{game.company}</span>
                                                )}
                                                {game.series && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="truncate">
                                                            {game.series}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            {isUpdating ? (
                                                <div className="flex items-center gap-2 text-head-gray-500">
                                                    <svg
                                                        className="animate-spin h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    <span className="text-xs">저장 중...</span>
                                                </div>
                                            ) : isCompleted ? (
                                                <span className="text-xs font-semibold text-head-blue bg-head-blue/10 px-3 py-1 rounded-full">
                                                    완료
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-head-gray-400 bg-head-gray-100 px-3 py-1 rounded-full">
                                                    미완료
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
