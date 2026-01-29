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
    const [excludePartySeries, setExcludePartySeries] = useState<boolean>(false);
    const [excludeSinglePlayer, setExcludeSinglePlayer] = useState<boolean>(false);
    const [excludeTwoPlayer, setExcludeTwoPlayer] = useState<boolean>(false);
    const [numGroups, setNumGroups] = useState<number | undefined>(undefined);

    const { matches, combinations, loading, executeMatch } = useMatch();

    const togglePlayer = (id: string) => {
        setSelectedPlayers((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    };

    const handleMatch = () => {
        executeMatch({
            playerIds: selectedPlayers,
            useCombination: true, // 항상 조합 매칭 사용
            excludePartySeries,
            excludeSinglePlayer,
            excludeTwoPlayer,
            numGroups,
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-head-gray-800">게임 매칭</h1>
            <section className="rounded-2xl bg-head-white shadow-soft p-6 space-y-4">
                <div>
                    <h2 className="font-semibold text-head-gray-800">참가자 선택</h2>
                    <p className="text-xs text-head-gray-500 mt-1">
                        선택된 참가자: {selectedPlayers.length}명
                    </p>
                </div>

                <MatchOptions
                    excludePartySeries={excludePartySeries}
                    excludeSinglePlayer={excludeSinglePlayer}
                    excludeTwoPlayer={excludeTwoPlayer}
                    numGroups={numGroups}
                    selectedPlayersCount={selectedPlayers.length}
                    onExcludePartySeriesChange={setExcludePartySeries}
                    onExcludeSinglePlayerChange={setExcludeSinglePlayer}
                    onExcludeTwoPlayerChange={setExcludeTwoPlayer}
                    onNumGroupsChange={setNumGroups}
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
                    className="w-full rounded-lg bg-head-blue py-2.5 text-head-white font-semibold disabled:bg-head-gray-300 disabled:text-head-gray-500 hover:bg-head-blue-dark transition"
                >
                    {loading ? "매칭 중..." : "조합 추천 보기"}
                </button>
            </section>

            {combinations.length > 0 && (
                <CombinationResult combinations={combinations} players={players} />
            )}

            {matches.length > 0 && <SingleGameResult matches={matches} />}
        </div>
    );
}
