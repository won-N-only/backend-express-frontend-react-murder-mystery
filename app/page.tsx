"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "./lib/fetcher";
import type { Player, PlayerStat } from "./types";

interface CompletedGame {
    gameId: string;
    gameName: string;
    orderNumber: number;
    completedAt: Date | null;
}

function PlayerAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
    const initial = name.length >= 2 ? name.slice(0, 2) : name.slice(0, 1);
    const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
    return (
        <div
            className={`${sizeClass} rounded-full bg-head-blue text-head-white flex items-center justify-center font-medium shrink-0`}
        >
            {initial}
        </div>
    );
}

function GraduationChart({ rate }: { rate: number }) {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (rate / 100) * circumference;
    return (
        <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#d1d5db" strokeWidth="8" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-head-gray-800">{Math.round(rate)}%</span>
            </div>
        </div>
    );
}

export default function HomePage() {
    const { data: playersData } = useSWR<{ players: Player[] }>("/api/players", fetcher);
    const players = useMemo(() => playersData?.players ?? [], [playersData?.players]);

    const { data: statsData } = useSWR<{ stats: { players?: PlayerStat[] } }>(
        "/api/stats",
        fetcher,
    );
    const playerStats = useMemo(() => statsData?.stats?.players ?? [], [statsData?.stats?.players]);

    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const selectedPlayer = useMemo(() => {
        const id = selectedPlayerId ?? players[0]?._id;
        return players.find((p) => p._id === id) ?? players[0] ?? null;
    }, [players, selectedPlayerId]);

    const selectedStat = useMemo(
        () => playerStats.find((s) => s.playerId === selectedPlayer?._id) ?? null,
        [playerStats, selectedPlayer],
    );

    const { data: completedData } = useSWR<{ completedGames: CompletedGame[] }>(
        selectedPlayer ? `/api/stats/players/${selectedPlayer._id}/completed-games` : null,
        fetcher,
    );
    const completedGames = completedData?.completedGames ?? [];
    const recentPlays = completedGames.slice(0, 5);

    const topPercent = useMemo(() => {
        if (!selectedStat || playerStats.length === 0) return null;
        const sorted = [...playerStats].sort((a, b) => b.completionRate - a.completionRate);
        const rank = sorted.findIndex((s) => s.playerId === selectedStat.playerId) + 1;
        if (rank <= 0) return null;
        // 상위 퍼센트 계산: 1등이면 상위 1%, 2등이면 상위 2% 등
        // rank가 작을수록 상위에 있으므로 rank / total * 100
        const percent = (rank / playerStats.length) * 100;
        // 소수점 첫째 자리까지 표시하되, 1% 미만이면 1%로 표시
        return Math.max(1, Math.round(percent * 10) / 10);
    }, [selectedStat, playerStats]);

    return (
        <div className="space-y-6">
            {/* 어떤 탐정의 기록을 볼까요? */}
            <section className="rounded-2xl bg-head-white shadow-soft p-6">
                <h2 className="text-head-gray-800 font-semibold mb-4">
                    어떤 탐정의 기록을 볼까요?
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {players.map((p) => {
                        const isSelected = selectedPlayer?._id === p._id;
                        return (
                            <button
                                key={p._id}
                                type="button"
                                onClick={() => setSelectedPlayerId(p._id)}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                    isSelected
                                        ? "bg-head-blue text-head-white border-head-blue shadow-soft"
                                        : "bg-head-white hover:bg-head-gray-100 border-head-gray-300 text-head-gray-800"
                                }`}
                            >
                                {p.name}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* OO님의 졸업률 */}
            {selectedPlayer && selectedStat && (
                <section className="rounded-2xl bg-head-white shadow-soft p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-head-gray-800 font-semibold mb-2 text-xl">
                                {selectedPlayer.name}님의 졸업률
                            </h2>
                            {topPercent != null && (
                                <p className="text-head-blue font-semibold text-lg mb-1">
                                    상위 {topPercent}%
                                </p>
                            )}
                            <p className="text-head-gray-500 text-sm">
                                {selectedStat.completedCount}개 완료 · 전체{" "}
                                {selectedStat.totalGames}개 중
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <GraduationChart rate={selectedStat.completionRate} />
                        </div>
                    </div>
                </section>
            )}

            {/* 최근 플레이 */}
            <section className="rounded-2xl bg-head-white shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-head-gray-800 font-semibold text-lg">최근 플레이</h2>
                    <Link
                        href="/stats"
                        className="text-sm text-head-blue font-medium hover:text-head-blue-dark transition-colors"
                    >
                        전체보기
                    </Link>
                </div>
                {recentPlays.length === 0 ? (
                    <p className="text-head-gray-500 text-sm py-4">
                        {selectedPlayer ? "완료한 게임이 없습니다." : "탐정을 선택해주세요."}
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {recentPlays.map((game) => (
                            <li
                                key={game.gameId}
                                className="flex items-center gap-3 py-3 px-2 border-b border-head-gray-100 last:border-0 hover:bg-head-gray-50 rounded-lg transition-colors"
                            >
                                {selectedPlayer && (
                                    <PlayerAvatar name={selectedPlayer.name} size="sm" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-head-gray-800 font-medium truncate">
                                        {game.gameName}
                                    </p>
                                    <p className="text-head-gray-500 text-xs mt-0.5">완료</p>
                                </div>
                                <Link
                                    href={`/games/${game.gameId}`}
                                    className="shrink-0 rounded-lg border border-head-blue text-head-blue px-4 py-1.5 text-sm font-medium hover:bg-head-blue hover:text-head-white transition-colors"
                                >
                                    완료
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
