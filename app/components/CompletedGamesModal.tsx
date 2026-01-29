"use client";

import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

interface CompletedGamesModalProps {
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

export default function CompletedGamesModal({
    playerId,
    playerName,
    onClose,
}: CompletedGamesModalProps) {
    const { data: completedGamesData, isLoading } = useSWR<{ completedGames: CompletedGame[] }>(
        playerId ? `/api/stats/players/${playerId}/completed-games` : null,
        fetcher,
    );
    const completedGames = completedGamesData?.completedGames ?? [];

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
                {/* 헤더 - sticky */}
                <div className="sticky top-0 bg-head-white z-10 p-6 border-b border-head-gray-200 flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-head-gray-800">
                                {playerName}님의 완료한 게임
                            </h2>
                            <p className="text-sm text-head-gray-500 mt-1">
                                총 {completedGames.length}개 완료
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-head-gray-500 hover:text-head-gray-800 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* 콘텐츠 영역 - 스크롤 가능 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* 완료한 게임 목록 */}
                    {isLoading ? (
                        <div className="text-center py-8 text-head-gray-500">로딩 중...</div>
                    ) : completedGames.length === 0 ? (
                        <div className="text-center py-8 text-head-gray-500">
                            완료한 게임이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {completedGames.map((game) => (
                                <Link
                                    key={game.gameId}
                                    href={`/games/${game.gameId}`}
                                    className="block rounded-lg border border-head-gray-300 bg-head-white p-4 hover:shadow-md hover:border-head-blue transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-head-gray-500 bg-head-gray-100 px-2 py-0.5 rounded">
                                                    #{game.orderNumber}
                                                </span>
                                                <span className="font-medium text-head-gray-800 truncate">
                                                    {game.gameName}
                                                </span>
                                            </div>
                                            {game.completedAt && (
                                                <p className="text-xs text-head-gray-500">
                                                    완료일:{" "}
                                                    {new Date(game.completedAt).toLocaleDateString(
                                                        "ko-KR",
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 ml-4">
                                            <span className="text-xs font-semibold text-head-blue bg-head-blue/10 px-3 py-1 rounded-full">
                                                완료
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
