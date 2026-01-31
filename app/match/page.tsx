"use client";

import PageHeader from "@app/components/common/PageHeader";
import PlayerListGrid from "@app/components/common/PlayerListGrid";
import CombinationResult from "@app/components/pages/match/CombinationResult";
import MatchOptions from "@app/components/pages/match/MatchOptions";
import SingleGameResult from "@app/components/pages/match/SingleGameResult";
import { useMatch } from "@app/hooks/useMatch";
import { fetcher } from "@app/lib/fetcher";
import type { Player } from "@app/types";
import { useState } from "react";
import useSWR from "swr";

export default function MatchPage() {
    const { data: playersData } = useSWR("/api/players", fetcher);
    const players: Player[] = playersData?.players ?? [];

    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [excludePartySeries, setExcludePartySeries] = useState<boolean>(true);
    const [excludeSinglePlayer, setExcludeSinglePlayer] = useState<boolean>(true);
    const [excludeTwoPlayer, setExcludeTwoPlayer] = useState<boolean>(true);
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
        <div>
            <PageHeader title="사건 배당" description="친절하게 배정해드려요" />

            <div className="pt-section">
                <div className="text-head-text text-2xl font-bold mb-2">참가자 선택</div>
                <span className="font-extrabold">선택된 참가자</span> {selectedPlayers.length}명
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
            <PlayerListGrid
                players={players}
                selectedPlayerIds={selectedPlayers}
                onSelectPlayer={togglePlayer}
            />

            <button
                type="button"
                onClick={handleMatch}
                disabled={loading || !selectedPlayers.length}
                className="mt-section w-1/4 block h-12 btn-primary"
            >
                {loading ? "매칭 중..." : "조합 추천 보기"}
            </button>

            {combinations.length > 0 && (
                <div>
                    <div className="pt-section">
                        <div className="text-head-text text-2xl font-bold">추천 조합</div>
                        <div className="line mt-subtitle" aria-hidden />
                    </div>
                    <CombinationResult combinations={combinations} players={players} />
                </div>
            )}

            {matches.length > 0 && <SingleGameResult matches={matches} />}
        </div>
    );
}
