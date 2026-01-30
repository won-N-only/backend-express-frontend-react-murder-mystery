"use client";

import { fetcher } from "@app/lib/fetcher";
import type { CompletedGame } from "@app/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

interface CompletedGamesModalProps {
    playerId: string | null;
    playerName: string | null;
    onClose: () => void;
    /** 제공 시 게임 클릭 시 이 콜백만 호출(모달 열기). 미제공 시 /games?gameId= 로 이동 */
    onOpenGameDetail?: (gameId: string) => void;
}

export default function CompletedGamesModal({
    playerId,
    playerName,
    onClose,
    onOpenGameDetail,
}: CompletedGamesModalProps) {
    const router = useRouter();
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
                className="bg-head-white rounded-2xl shadow-soft max-w-content w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-head-white z-10 p-6 border-b border-head-border flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-head-text">
                                {playerName}님의 완료한 게임
                            </h2>
                            <p className="text-sm text-head-text mt-1">
                                총 {completedGames.length}개 완료
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-head-text hover:text-head-text text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center py-8 text-head-text">로딩 중...</div>
                    ) : completedGames.length === 0 ? (
                        <div className="text-center py-8 text-head-text">
                            완료한 게임이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {completedGames.map((game) => (
                                <button
                                    key={game.gameId}
                                    type="button"
                                    onClick={() => {
                                        if (onOpenGameDetail) {
                                            onClose();
                                            onOpenGameDetail(game.gameId);
                                        } else {
                                            onClose();
                                            router.push(`/games?gameId=${game.gameId}`);
                                        }
                                    }}
                                    className="block w-full text-left rounded-lg border border-head-border bg-head-white p-4 hover:shadow-md hover:border-head-border transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-head-text bg-head-gray-100 px-2 py-0.5 rounded">
                                                    #{game.orderNumber}
                                                </span>
                                                <span className="font-medium text-head-text truncate">
                                                    {game.gameName}
                                                </span>
                                            </div>
                                            {game.completedAt && (
                                                <p className="text-xs text-head-text mt-1">
                                                    완료일:{" "}
                                                    {new Date(game.completedAt).toLocaleDateString(
                                                        "ko-KR",
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 ml-4">
                                            <span className="text-xs font-semibold text-head-brown bg-head-brown/10 px-3 py-1 rounded-full">
                                                완료
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
