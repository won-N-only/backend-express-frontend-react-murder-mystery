"use client";

import CompletedGamesModal from "@app/components/common/CompletedGamesModal";
import PageHeader from "@app/components/common/PageHeader";
import type { CompanyStat, PlayerStat } from "@app/types";
import { useState } from "react";

interface StatsSectionProps {
    players: PlayerStat[];
    companies: CompanyStat[];
}

export default function StatsSection({ players, companies }: StatsSectionProps) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);

    const getProgressColorByRank = (rank: number) => {
        if (rank <= 3) return "from-[#4C7382] to-[#7CABB8]";
        if (rank <= 16) return "from-[#EB9262] to-[#F5C7B0]";
        return "from-[#FFDDAA] to-[#E0F5D0]";
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
            <div className="space-y-section">
                <PageHeader
                    title="대머리 성적표"
                    description="머리를 얼마나 썼는지 확인해볼까요?"
                />

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-head-text">대머리 졸업 순위</h2>
                    <div className="grid gap-4 md:grid-cols-1">
                        {players.map((p, index) => (
                            <div
                                key={p.playerId}
                                className="section-card"
                                onClick={() => handlePlayerClick(p.playerId, p.playerName)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{index + 1 + "."}</span>
                                        <span className="font-bold text-lg text-head-text">
                                            {p.playerName}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-head-brown">
                                            {p.completionRate.toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-head-text">
                                            {p.completedCount} 개 완료 - 전체 {p.totalGames} 개 중
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-3">
                                    <div className="h-4 rounded-full bg-head-gray-300 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${getProgressColorByRank(
                                                index + 1,
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
