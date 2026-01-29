"use client";

import CompletedGamesModal from "@app/components/common/CompletedGamesModal";
import GameCheckModal from "@app/components/common/GameCheckModal";
import GraduationChart from "@app/components/common/GraduationChart";
import RecentPlaysList from "@app/components/pages/history/RecentPlaysList";
import { fetcher } from "@app/lib/fetcher";
import { useSelectedPlayer } from "@app/providers/SelectedPlayerProvider";
import type { CompletedGame, Player, PlayerStat } from "@app/types";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function HistorySection() {
    const { selectedPlayerId, setSelectedPlayerId } = useSelectedPlayer();

    const { data: playersData } = useSWR<{ players: Player[] }>("/api/players", fetcher);
    const players = useMemo(() => playersData?.players ?? [], [playersData?.players]);

    const { data: statsData } = useSWR<{ stats: { players?: PlayerStat[] } }>(
        "/api/stats",
        fetcher,
    );
    const playerStats = useMemo(() => statsData?.stats?.players ?? [], [statsData?.stats?.players]);

    const [showCompletedGamesModal, setShowCompletedGamesModal] = useState(false);
    const [showGameCheckModal, setShowGameCheckModal] = useState(false);

    const selectedPlayer = useMemo(() => {
        if (!selectedPlayerId) return null;
        return players.find((p) => p._id === selectedPlayerId) ?? null;
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
        const percent = (rank / playerStats.length) * 100;
        return Math.max(1, Math.round(percent * 10) / 10);
    }, [selectedStat, playerStats]);

    return (
        <div className="space-y-6">
            <section className="rounded-2xl bg-head-white shadow-soft p-6">
                <h2 className="text-head-gray-800 font-semibold mb-4">
                    어떤 대머리의 이력을 볼까요?
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
                    <div className="mt-4 pt-4 border-t border-head-gray-200">
                        <button
                            onClick={() => setShowGameCheckModal(true)}
                            className="w-full rounded-lg bg-head-blue text-head-white px-4 py-2.5 text-xl font-medium hover:bg-head-blue-dark transition-colors"
                        >
                            한 게임 체크하기
                        </button>
                    </div>
                </section>
            )}

            <RecentPlaysList
                plays={recentPlays}
                selectedPlayerName={selectedPlayer?.name ?? null}
                onViewAll={() => setShowCompletedGamesModal(true)}
                emptyMessage="완료한 게임이 없습니다."
                emptyHint="대머리를 선택해주세요."
            />

            <CompletedGamesModal
                playerId={showCompletedGamesModal ? (selectedPlayer?._id ?? null) : null}
                playerName={selectedPlayer?.name ?? null}
                onClose={() => setShowCompletedGamesModal(false)}
            />

            <GameCheckModal
                playerId={showGameCheckModal ? (selectedPlayer?._id ?? null) : null}
                playerName={selectedPlayer?.name ?? null}
                onClose={() => setShowGameCheckModal(false)}
            />
        </div>
    );
}
