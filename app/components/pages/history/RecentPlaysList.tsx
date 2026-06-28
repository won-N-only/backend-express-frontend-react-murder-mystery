"use client";

import { getCategoryStyle } from "@app/lib/categoryStyles";
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
                        className="cursor-pointer text-sm text-head-text font-medium hover:text-head-brown-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button" //  
                    >
                        전체보기
                    </button>
                </div>
                <hr className="border-gray-500/50  mt-4" />
                {plays.length === 0 ? (
                    <p className="text-head-text text-sm py-4 mt-4">
                        {selectedPlayerName ? emptyMessage : emptyHint}
                    </p>
                ) : (
                    <ul className="  list-none">
                        {plays.map((game, index) => (
                            <Fragment key={game.gameId}>
                                {index > 0 && (
                                    <li
                                        className="line border-gray-500/50"
                                        aria-hidden
                                        role="presentation"
                                    />
                                )}
                                <li className="flex items-center py-4 transition-colors ">
                                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openGameDetail(game.gameId)}
                                            className="text-head-text text-lg font-medium truncate hover:text-head-brown transition-colors block text-left w-full"
                                        >
                                            {game.gameName}
                                        </button>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {game.category && (
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-none ${getCategoryStyle(game.category).badge}`}
                                                >
                                                    {game.category}
                                                </span>
                                            )}
                                            {game.completedAt && (
                                                <p className="text-head-text text-sm">
                                                    {new Date(game.completedAt).toLocaleDateString(
                                                        "ko-KR",
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openGameDetail(game.gameId)}
                                            className=" shrink-0 w-fit bg-head-white border border-1 border-head-border text-head-brown text-md font-extrabold hover:bg-head-brown hover:text-head-white transition-colors btn-standard-padding"
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
