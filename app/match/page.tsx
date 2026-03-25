"use client";

import GameListItem from "@app/components/common/GameListItem"; // Import GameListItem
import GameListModal from "@app/components/common/GameListModal"; // Import GameListModal
import PageHeader from "@app/components/common/PageHeader";
import PlayerListGrid from "@app/components/common/PlayerListGrid";
import GameModal from "@app/components/pages/games/GameModal"; // Import GameModal
import CombinationResult from "@app/components/pages/match/CombinationResult";
import MatchOptions from "@app/components/pages/match/MatchOptions";
import SingleGameResult from "@app/components/pages/match/SingleGameResult";
import { useMatch } from "@app/hooks/useMatch";
import { fetcher } from "@app/lib/fetcher";
import type { Game, Player } from "@app/types";
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
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null); // State for GameModal
    const [showPlayableGamesModal, setShowPlayableGamesModal] = useState(false); // State for Playable Games Modal
    const [fetchPlayableGames, setFetchPlayableGames] = useState(false); // State to defer API call

    const { matches, combinations, loading, executeMatch } = useMatch();
    const isCombinationReady = selectedPlayers.length >= 6;

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

    // Fetch playable games based on selected players, deferred until button click
    const { data: playableGamesData, isLoading: isLoadingPlayableGames } = useSWR<{
        games: Game[];
    }>(
        fetchPlayableGames && selectedPlayers.length > 0
            ? `/api/match/playable-games?playerIds=${selectedPlayers.join(",")}`
            : null,
        fetcher,
    );
    const playableGames = playableGamesData?.games ?? [];

    return (
        <div>
            <PageHeader title="조합 추천" description="맞춤 플레이 조합을 받아보세요 " />

            <div className="pt-section">
                <div className="text-head-text text-2xl font-bold mb-2">참가자 선택</div>
                <span className="font-extrabold">선택된 참가자</span> {selectedPlayers.length}명
                {!isCombinationReady && selectedPlayers.length > 0 && (
                    <p className="mt-2 text-xs text-head-text/80 bg-head-white border border-head-border px-3 py-2">
                        조합 추천은 6인 이상일 때만 동작해요 ㅠ.ㅠ 한 팀만 돌릴 때는 아래{" "}
                        <span className="font-bold">&quot;플레이 가능한 게임 목록 보기&quot;</span>를
                        사용해 주세요.
                    </p>
                )}
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

            <div className="flex flex-row gap-2">
                {/* 조합 만들기 버튼 */}
                <button
                    type="button"
                    onClick={handleMatch}
                    disabled={loading || !isCombinationReady}
                    className="mt-section block btn-primary btn-standard-padding"
                >
                    {loading
                        ? "조합 만드는 중..."
                        : !isCombinationReady
                          ? "조합 만들기 (6인 이상)"
                          : "조합 만들기"}
                </button>

                {/* 플레이 가능한 게임 목록 보기 버튼 */}
                {selectedPlayers.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            setShowPlayableGamesModal(true);
                            setFetchPlayableGames(true);
                        }}
                        disabled={selectedPlayers.length === 0} // Disable if no players selected, regardless of API call status
                        className="mt-section block btn-primary btn-standard-padding"
                    >
                        {isLoadingPlayableGames && fetchPlayableGames // Only show loading if fetch has been triggered
                            ? "플레이 가능한 게임 로딩 중..."
                            : "플레이 가능한 게임 목록 보기"}
                    </button>
                )}
            </div>

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

            <GameModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)} />

            {/* 플레이 가능한 게임 목록 모달 */}
            {showPlayableGamesModal && (
                <GameListModal
                    title="플레이 가능한 게임"
                    onClose={() => {
                        setShowPlayableGamesModal(false);
                        setFetchPlayableGames(false); // Reset fetch status when modal closes
                    }}
                    isLoading={isLoadingPlayableGames}
                    isEmpty={!isLoadingPlayableGames && playableGames.length === 0}
                    emptyMessage="선택된 참가자로 플레이 가능한 게임이 없습니다."
                >
                    {playableGames.map((game) => (
                        <GameListItem
                            key={game._id}
                            orderNumber={game.orderNumber}
                            title={game.name}
                            onClick={() => {
                                setSelectedGameId(game._id);
                                setShowPlayableGamesModal(false);
                            }}
                        />
                    ))}
                </GameListModal>
            )}
        </div>
    );
}
