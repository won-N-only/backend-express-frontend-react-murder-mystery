"use client";

import type { CompletedGame } from "@app/types";
import Link from "next/link";

interface RecentPlaysListProps {
    plays: CompletedGame[];
    selectedPlayerName: string | null;
    onViewAll: () => void;
    emptyMessage?: string;
    emptyHint?: string;
}

export default function RecentPlaysList({
    plays,
    selectedPlayerName,
    onViewAll,
    emptyMessage = "완료한 게임이 없습니다.",
    emptyHint = "대머리를 선택해주세요.",
}: RecentPlaysListProps) {
    return (
        <section className="rounded-2xl bg-gradient-to-b from-white to-head-main p-6 shadow-none border border-head-gray-200/60">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-head-gray-800 font-bold text-xl">완료한 게임</h2>
                <button
                    onClick={onViewAll}
                    className="text-sm text-head-brown font-medium hover:text-head-brown-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedPlayerName}
                >
                    전체보기
                </button>
            </div>
            {plays.length === 0 ? (
                <p className="text-head-gray-500 text-sm py-4">
                    {selectedPlayerName ? emptyMessage : emptyHint}
                </p>
            ) : (
                <ul className="space-y-3">
                    {plays.map((game) => (
                        <li
                            key={game.gameId}
                            className="flex items-center gap-3 py-3 px-2 border-b border-head-gray-100 last:border-0 hover:bg-head-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/games/${game.gameId}`}
                                    className="text-head-gray-800 font-medium truncate hover:text-head-brown transition-colors block"
                                >
                                    {game.gameName}
                                </Link>
                                {game.completedAt && (
                                    <p className="text-head-gray-500 text-xs mt-0.5">
                                        {new Date(game.completedAt).toLocaleDateString("ko-KR")}
                                    </p>
                                )}
                            </div>
                            <Link
                                href={`/games/${game.gameId}`}
                                className="shrink-0 rounded-lg border border-head-brown text-head-brown px-4 py-1.5 text-sm font-medium hover:bg-head-brown hover:text-head-white transition-colors"
                            >
                                상세보기
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
