"use client";

import { fetcher } from "@app/lib/fetcher";
import type { CompletedGame } from "@app/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import GameListItem from "./GameListItem";
import GameListModal from "./GameListModal";

interface CompletedGamesModalProps {
    playerId: string | null;
    playerName: string | null;
    onClose: () => void;
    /** 제공 시 게임 클릭 시 이 콜백만 호출(모달 열기). 미제공 시 /games?gameId= 로 이동 */
    onOpenGameDetail?: (gameId: string) => void;
}

export default function CompletedGamesModal({
    playerId,
    playerName,
    onClose,
    onOpenGameDetail,
}: CompletedGamesModalProps) {
    const router = useRouter();
    const { data: completedGamesData, isLoading } = useSWR<{ completedGames: CompletedGame[] }>(
        playerId ? `/api/stats/players/${playerId}/completed-games` : null,
        fetcher,
    );
    const completedGames = completedGamesData?.completedGames ?? [];

    const [searchQuery, setSearchQuery] = useState("");
    const [playerCountRange, setPlayerCountRange] = useState<"ALL" | "1-2" | "3-4" | "5+">("ALL");

    const filteredGames = useMemo(() => {
        let list = completedGames;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((g) => g.gameName.toLowerCase().includes(q));
        }

        return list.filter((g) => {
            if (playerCountRange === "ALL") return true;

            const min = g.minPlayers;
            const max = g.maxPlayers ?? g.minPlayers;

            if (playerCountRange === "1-2") return max >= 1 && min <= 2;
            if (playerCountRange === "3-4") return max >= 3 && min <= 4;
            if (playerCountRange === "5+") return min >= 5;

            return true;
        });
    }, [completedGames, searchQuery, playerCountRange]);

    if (!playerId) return null;

    const hasAnyCompleted = completedGames.length > 0;

    return (
        <GameListModal
            title={`${playerName}님의 완료한 게임`}
            subtitle={`총 ${completedGames.length}개 완료`}
            onClose={onClose}
            isLoading={isLoading}
            isEmpty={filteredGames.length === 0}
            emptyMessage={
                hasAnyCompleted ? "조건에 맞는 완료 게임이 없습니다." : "완료한 게임이 없습니다."
            }
            searchProps={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: "게임 이름으로 검색",
            }}
        >
            <div className="mb-4 flex flex-wrap gap-2">
                {[
                    { key: "ALL", label: "전체" },
                    { key: "1-2", label: "1~2인" },
                    { key: "3-4", label: "3~4인" },
                    { key: "5+", label: "5인 이상" },
                ].map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                            setPlayerCountRange(option.key as "ALL" | "1-2" | "3-4" | "5+")
                        }
                        className={`px-3 py-1 text-sm font-semibold border border-head-border ${
                            playerCountRange === option.key
                                ? "bg-head-brown text-white"
                                : "bg-head-white text-head-text"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            {filteredGames.map((game) => (
                <GameListItem
                    key={game.gameId}
                    orderNumber={game.orderNumber}
                    title={game.gameName}
                    subtitle={
                        game.completedAt
                            ? `완료일: ${new Date(game.completedAt).toLocaleDateString("ko-KR")}`
                            : undefined
                    }
                    action={
                        <span className="text-md font-extrabold text-head-white bg-head-brown px-6 py-1 rounded-none">
                            완료
                        </span>
                    }
                    onClick={() => {
                        if (onOpenGameDetail) {
                            onClose();
                            onOpenGameDetail(game.gameId);
                        } else {
                            onClose();
                            router.push(`/games?gameId=${game.gameId}`);
                        }
                    }}
                />
            ))}
        </GameListModal>
    );
}
