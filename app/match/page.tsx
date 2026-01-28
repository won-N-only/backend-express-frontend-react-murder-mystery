"use client";

import { useState } from "react";
import useSWR from "swr";
import CombinationResult from "../components/CombinationResult";
import MatchOptions from "../components/MatchOptions";
import PlayerSelector from "../components/PlayerSelector";
import SingleGameResult from "../components/SingleGameResult";
import { useMatch } from "../hooks/useMatch";
import { fetcher } from "../lib/fetcher";
import type { Player } from "../types";

export default function MatchPage() {
    const { data: playersData } = useSWR("/api/players", fetcher);
    const players: Player[] = playersData?.players ?? [];

    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [playerCount, setPlayerCount] = useState<number>(4);
    const [useCombination, setUseCombination] = useState<boolean>(true);
    const [excludePartySeries, setExcludePartySeries] = useState<boolean>(false);
    const [excludeSinglePlayer, setExcludeSinglePlayer] = useState<boolean>(false);

    const { matches, combinations, loading, executeMatch } = useMatch();

    const togglePlayer = (id: string) => {
        setSelectedPlayers((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    };

    const handleMatch = () => {
        executeMatch({
            playerIds: selectedPlayers,
            playerCount,
            useCombination,
            excludePartySeries,
            excludeSinglePlayer,
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">게임 매칭</h1>
            <section className="rounded-2xl bg-white/80 shadow p-6 space-y-4">
                <div>
                    <h2 className="font-semibold">참가자 선택</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        선택된 참가자: {selectedPlayers.length}명
                    </p>
                </div>

                <MatchOptions
                    useCombination={useCombination}
                    excludePartySeries={excludePartySeries}
                    excludeSinglePlayer={excludeSinglePlayer}
                    playerCount={playerCount}
                    onUseCombinationChange={setUseCombination}
                    onExcludePartySeriesChange={setExcludePartySeries}
                    onExcludeSinglePlayerChange={setExcludeSinglePlayer}
                    onPlayerCountChange={setPlayerCount}
                />

                <PlayerSelector
                    players={players}
                    selectedPlayers={selectedPlayers}
                    onToggle={togglePlayer}
                />

                <button
                    type="button"
                    onClick={handleMatch}
                    disabled={loading || !selectedPlayers.length}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold disabled:bg-slate-400 hover:bg-blue-700 transition"
                >
                    {loading ? "매칭 중..." : useCombination ? "조합 추천 보기" : "추천 게임 보기"}
                </button>
            </section>

            {combinations.length > 0 && (
                <CombinationResult combinations={combinations} players={players} />
            )}

            {matches.length > 0 && <SingleGameResult matches={matches} />}
        </div>
    );
}
