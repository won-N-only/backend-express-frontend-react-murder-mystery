"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import type { CompanyStat, PlayerStat } from "../types";

interface StatsSectionProps {
    players: PlayerStat[];
    companies: CompanyStat[];
}

interface CompletedGame {
    gameId: string;
    gameName: string;
    orderNumber: number;
    completedAt: Date | null;
}

export default function StatsSection({ players, companies }: StatsSectionProps) {
    const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
    const { data: completedGamesData } = useSWR<{ completedGames: CompletedGame[] }>(
        expandedPlayerId ? `/api/stats/players/${expandedPlayerId}/completed-games` : null,
        fetcher,
    );
    const completedGames = completedGamesData?.completedGames ?? [];

    const getRankEmoji = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `${index + 1}.`;
    };

    const getProgressColor = (rate: number) => {
        if (rate >= 80) return "from-emerald-500 to-green-600";
        if (rate >= 50) return "from-blue-500 to-blue-600";
        if (rate >= 30) return "from-yellow-500 to-orange-500";
        return "from-red-400 to-red-500";
    };

    const togglePlayer = (playerId: string) => {
        setExpandedPlayerId(expandedPlayerId === playerId ? null : playerId);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">통계</h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">참가자별 졸업률</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {players.map((p, index) => {
                        const isExpanded = expandedPlayerId === p.playerId;
                        const currentCompletedGames = isExpanded ? completedGames : [];

                        return (
                            <div
                                key={p.playerId}
                                className="rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-lg border border-slate-200 p-5 hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => togglePlayer(p.playerId)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getRankEmoji(index)}</span>
                                        <span className="font-bold text-lg">{p.playerName}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {p.completionRate.toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {p.completedCount}/{p.totalGames} 완료
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 rounded-full bg-slate-200 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                                                p.completionRate,
                                            )} transition-all duration-500 flex items-center justify-end pr-2`}
                                            style={{ width: `${Math.min(100, p.completionRate)}%` }}
                                        >
                                            {p.completionRate >= 10 && (
                                                <span className="text-xs text-white font-medium">
                                                    {Math.round(p.completionRate)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {p.completionRate === 100 && (
                                        <div className="text-center text-xs font-semibold text-emerald-600 mt-1">
                                            ✨ 완벽한 졸업! ✨
                                        </div>
                                    )}
                                </div>
                                {isExpanded && (
                                    <div
                                        className="mt-4 pt-4 border-t border-slate-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="text-sm font-semibold mb-2 text-slate-700">
                                            완료한 게임 ({currentCompletedGames.length}개)
                                        </div>
                                        {currentCompletedGames.length === 0 ? (
                                            <div className="text-xs text-slate-500">
                                                완료한 게임이 없습니다.
                                            </div>
                                        ) : (
                                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                                {currentCompletedGames.map((game) => (
                                                    <a
                                                        key={game.gameId}
                                                        href={`/games/${game.gameId}`}
                                                        className="block text-xs text-slate-600 hover:text-blue-600 hover:underline py-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        #{game.orderNumber} {game.gameName}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">제작사별 요약</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {companies.map((c) => (
                        <div
                            key={c.company}
                            className="rounded-xl bg-white/80 shadow px-4 py-3 text-sm hover:shadow-md transition-shadow"
                        >
                            <div className="font-semibold mb-1">{c.company}</div>
                            <div className="text-slate-600">게임 수: {c.gameCount}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
