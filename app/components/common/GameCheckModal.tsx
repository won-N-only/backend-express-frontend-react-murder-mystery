"use client";

import { fetcher } from "@app/lib/fetcher";
import type { CompletedGame, Game } from "@app/types";
import { CompletionStatus } from "@app/types";
import { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import GameListItem from "./GameListItem";
import GameListModal from "./GameListModal";

interface GameCheckModalProps {
    playerId: string | null;
    playerName: string | null;
    onClose: () => void;
}

export default function GameCheckModal({ playerId, playerName, onClose }: GameCheckModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingGameIds, setUpdatingGameIds] = useState<Set<string>>(new Set());

    const { data: gamesData, isLoading: isLoadingGames } = useSWR<{ games: Game[] }>(
        "/api/games",
        fetcher,
    );
    const { data: completedGamesData, isLoading: isLoadingCompleted } = useSWR<{
        completedGames: CompletedGame[];
    }>(playerId ? `/api/stats/players/${playerId}/completed-games` : null, fetcher);

    const games = useMemo(() => gamesData?.games ?? [], [gamesData?.games]);
    const completedGames = useMemo(
        () => completedGamesData?.completedGames ?? [],
        [completedGamesData?.completedGames],
    );

    const completedGameIds = useMemo(
        () => new Set(completedGames.map((g) => g.gameId)),
        [completedGames],
    );

    const filteredGames = useMemo(() => {
        if (!searchQuery.trim()) return games;
        const query = searchQuery.toLowerCase();
        return games.filter(
            (game) =>
                game.name.toLowerCase().includes(query) ||
                game.company?.toLowerCase().includes(query) ||
                game.series?.toLowerCase().includes(query),
        );
    }, [games, searchQuery]);

    const updateStatus = async (gameId: string, isCompleted: boolean) => {
        if (!playerId) return;
        setUpdatingGameIds((prev) => new Set(prev).add(gameId));
        try {
            const status = isCompleted ? CompletionStatus.DONE : CompletionStatus.NOT_DONE;
            const response = await fetch(`/api/games/${gameId}/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, status }),
            });
            if (!response.ok) {
                const error = await response.json();
                console.error("Failed to update status:", error);
                return;
            }
            mutate(`/api/stats/players/${playerId}/completed-games`);
            mutate("/api/stats");
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdatingGameIds((prev) => {
                const next = new Set(prev);
                next.delete(gameId);
                return next;
            });
        }
    };

    if (!playerId) return null;

    return (
        <GameListModal
            title={`${playerName}님의 게임 체크`}
            subtitle="완료한 게임을 체크해주세요"
            onClose={onClose}
            searchProps={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: "게임 이름, 제작사, 시리즈로 검색",
            }}
            isLoading={isLoadingGames || isLoadingCompleted}
            isEmpty={filteredGames.length === 0}
            emptyMessage={searchQuery ? "검색 결과가 없습니다." : "게임이 없습니다."}
        >
            {filteredGames.map((game) => {
                const isCompleted = completedGameIds.has(game._id);
                const isUpdating = updatingGameIds.has(game._id);
                const subtitle = (
                    <>
                        {game.company && <span>{game.company}</span>}
                        {game.company && game.series && <span> · </span>}
                        {game.series && <span>{game.series}</span>}
                    </>
                );

                return (
                    <GameListItem
                        key={game._id}
                        orderNumber={game.orderNumber}
                        title={game.name}
                        subtitle={subtitle}
                        action={
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent modal close if clicked
                                    updateStatus(game._id, !isCompleted);
                                }}
                                disabled={isUpdating}
                                className={`font-bold text-sm transition-all btn-standard-padding  ${
                                    isUpdating ? "opacity-50 cursor-wait" : "cursor-pointer"
                                } ${
                                    isCompleted
                                        ? "bg-head-brown text-white"
                                        : "bg-head-main text-head-text"
                                }`}
                            >
                                {isUpdating ? "저장 중..." : isCompleted ? "완료" : "미완료"}
                            </button>
                        }
                    />
                );
            })}
        </GameListModal>
    );
}
