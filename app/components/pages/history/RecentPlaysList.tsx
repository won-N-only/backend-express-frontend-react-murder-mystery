"use client";

import type { CompletedGame } from "@app/types";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

interface RecentPlaysListProps {
    plays: CompletedGame[];
    selectedPlayerName: string | null;
    onViewAll: () => void;
    /** 제공 시 상세보기 클릭 시 이 콜백만 호출(모달 열기). 미제공 시 /games?gameId= 로 이동 */
    onOpenGameDetail?: (gameId: string) => void;
    emptyMessage?: string;
    emptyHint?: string;
}

export default function RecentPlaysList({
    plays,
    selectedPlayerName,
    onViewAll,
    onOpenGameDetail,
    emptyMessage = "완료한 게임이 없습니다.",
    emptyHint = "대머리를 선택해주세요.",
}: RecentPlaysListProps) {
    const router = useRouter();

    const openGameDetail = (gameId: string) => {
        if (onOpenGameDetail) {
            onOpenGameDetail(gameId);
        } else {
            router.push(`/games?gameId=${gameId}`);
        }
    };

    return (
        <div className="mt-subtitle">
            <section className="section-card">
                <div className="flex items-center justify-between">
                    <h2 className="text-head-text font-bold text-2xl">완료한 게임</h2>
                    <button
                        onClick={onViewAll}
                        className="text-sm text-head-brown font-medium hover:text-head-brown-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedPlayerName}
                    >
                        전체보기
                    </button>
                </div>
                {plays.length === 0 ? (
                    <p className="text-head-text text-sm py-4 mt-4">
                        {selectedPlayerName ? emptyMessage : emptyHint}
                    </p>
                ) : (
                    <ul className="mt-4 list-none">
                        {plays.map((game, index) => (
                            <Fragment key={game.gameId}>
                                {index > 0 && (
                                    <li className="line" aria-hidden role="presentation" />
                                )}
                                <li className="flex items-center gap-3 py-3 px-2  transition-colors">
                                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openGameDetail(game.gameId)}
                                            className="text-head-text font-medium truncate hover:text-head-brown transition-colors block text-left w-full"
                                        >
                                            {game.gameName}
                                        </button>
                                        {game.completedAt && (
                                            <p className="text-head-text text-xs">
                                                {new Date(game.completedAt).toLocaleDateString(
                                                    "ko-KR",
                                                )}
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => openGameDetail(game.gameId)}
                                            className="shrink-0 w-fit bg-white border border-head-border text-head-brown px-4 py-1 text-sm font-medium hover:bg-head-brown hover:text-head-white transition-colors"
                                        >
                                            상세보기
                                        </button>
                                    </div>
                                </li>
                            </Fragment>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
