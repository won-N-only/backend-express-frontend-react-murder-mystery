"use client";

import CompletedGamesModal from "@app/components/common/CompletedGamesModal";
import GameCheckModal from "@app/components/common/GameCheckModal";
import GraduationChart from "@app/components/common/GraduationChart";
import PageHeader from "@app/components/common/PageHeader";
import PlayerListGrid from "@app/components/common/PlayerListGrid";
import RecentPlaysList from "@app/components/pages/history/RecentPlaysList";
import { fetcher } from "@app/lib/fetcher";
import { useSelectedPlayer } from "@app/providers/SelectedPlayerProvider";
import type { CompletedGame, Player, PlayerStat } from "@app/types";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function HistoryPage() {
    const { selectedPlayerId, setSelectedPlayerId } = useSelectedPlayer();
    const [showCompletedGamesModal, setShowCompletedGamesModal] = useState(false);
    const [showGameCheckModal, setShowGameCheckModal] = useState(false);

    const { data: playersData } = useSWR<{ players: Player[] }>("/api/players", fetcher);
    const players = useMemo(() => playersData?.players ?? [], [playersData?.players]);

    const { data: statsData } = useSWR<{ stats: { players?: PlayerStat[] } }>(
        "/api/stats",
        fetcher,
    );
    const playerStats = useMemo(() => statsData?.stats?.players ?? [], [statsData?.stats?.players]);

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
            <PageHeader
                title="전과 기록"
                description="내가 저지른... 아니, 내가 해결한 수많은 사건들의 흔적."
            />
            <PlayerListGrid
                players={players}
                selectedPlayerIds={selectedPlayerId ? [selectedPlayerId] : []}
                onSelectPlayer={setSelectedPlayerId}
            />

            {selectedPlayer && selectedStat && (
                <div>
                    <section className="section-card">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-head-gray-800 font-bold mb-2 text-xl">
                                    {selectedPlayer.name}님의 졸업률
                                </h2>
                                {topPercent != null && (
                                    <p className="text-head-brown font-semibold text-lg mb-1">
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
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setShowGameCheckModal(true)}
                            className="bg-head-accent-brown text-white px-5 py-1 text-md font-bold shadow-soft hover:opacity-90 transition-opacity"
                        >
                            완료한 게임 체크하기
                        </button>
                    </div>
                </div>
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
