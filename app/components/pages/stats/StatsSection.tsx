"use client";

import CompletedGamesModal from "@app/components/common/CompletedGamesModal";
import type { CompanyStat, PlayerStat } from "@app/types";
import { useState } from "react";

interface StatsSectionProps {
    players: PlayerStat[];
    companies: CompanyStat[];
}

export default function StatsSection({ players, companies }: StatsSectionProps) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);

    const getRankEmoji = (index: number) => {
        if (index === 0) return "1";
        if (index === 1) return "2";
        if (index === 2) return "3";
        return `${index + 1}.`;
    };

    const getProgressColor = (rate: number) => {
        if (rate >= 80) return "from-emerald-500 to-green-600";
        if (rate >= 50) return "from-head-blue to-head-blue-dark";
        if (rate >= 30) return "from-yellow-500 to-orange-500";
        return "from-red-400 to-red-500";
    };

    const handlePlayerClick = (playerId: string, playerName: string) => {
        setSelectedPlayerId(playerId);
        setSelectedPlayerName(playerName);
    };

    const handleCloseModal = () => {
        setSelectedPlayerId(null);
        setSelectedPlayerName(null);
    };

    return (
        <>
            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-head-gray-800">통계</h1>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-head-gray-800">참가자별 졸업률</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {players.map((p, index) => (
                            <div
                                key={p.playerId}
                                className="rounded-xl bg-head-white shadow-soft border border-head-gray-300 p-5 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handlePlayerClick(p.playerId, p.playerName)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getRankEmoji(index)}</span>
                                        <span className="font-bold text-lg text-head-gray-800">
                                            {p.playerName}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-head-blue">
                                            {p.completionRate.toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-head-gray-500">
                                            {p.completedCount}/{p.totalGames} 완료
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 rounded-full bg-head-gray-300 overflow-hidden">
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
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-3">{/* 추후 뭔가 추가할 예정 */}</section>
            </div>

            <CompletedGamesModal
                playerId={selectedPlayerId}
                playerName={selectedPlayerName}
                onClose={handleCloseModal}
            />
        </>
    );
}
