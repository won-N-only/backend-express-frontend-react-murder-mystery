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

type CategoryFilterKey = "ALL" | "오프라인" | "크라임씬" | "온라인/미정발" | "우즈/리얼월드";

const CATEGORY_STYLES: Record<
    Exclude<CategoryFilterKey, "ALL">,
    { chip: string; badge: string }
> = {
    "오프라인": {
        chip: "bg-amber-400 text-white",
        badge: "bg-amber-50 text-amber-800",
    },
    "크라임씬": {
        chip: "bg-rose-500 text-white",
        badge: "bg-rose-50 text-rose-800",
    },
    "온라인/미정발": {
        chip: "bg-violet-400 text-white",
        badge: "bg-violet-50 text-violet-800",
    },
    "우즈/리얼월드": {
        chip: "bg-emerald-500 text-white",
        badge: "bg-emerald-50 text-emerald-800",
    },
};

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
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilterKey>("ALL");

    const filteredGames = useMemo(() => {
        let list = completedGames;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((g) => g.gameName.toLowerCase().includes(q));
        }

        if (categoryFilter !== "ALL") {
            list = list.filter((g) => g.category === categoryFilter);
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
    }, [completedGames, searchQuery, playerCountRange, categoryFilter]);

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
            {/* 인원 수 필터 */}
            <div className="mb-3 flex flex-wrap gap-2">
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
                        className={`px-3 py-1 text-sm font-semibold   ${
                            playerCountRange === option.key
                                ? "bg-head-brown text-white"
                                : "bg-head-white text-head-text"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* 카테고리 필터 */}
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setCategoryFilter("ALL")}
                    className={`px-3 py-1 text-sm font-semibold   ${
                        categoryFilter === "ALL"
                            ? "bg-head-brown text-white"
                            : "bg-head-white text-head-text"
                    }`}
                >
                    전체
                </button>
                {(Object.keys(CATEGORY_STYLES) as Exclude<CategoryFilterKey, "ALL">[]).map(
                    (cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1 text-sm font-semibold   ${
                                categoryFilter === cat
                                    ? CATEGORY_STYLES[cat].chip
                                    : "bg-head-white text-head-text"
                            }`}
                        >
                            {cat}
                        </button>
                    ),
                )}
            </div>

            {filteredGames.map((game) => {
                const catStyle =
                    game.category && game.category in CATEGORY_STYLES
                        ? CATEGORY_STYLES[game.category as Exclude<CategoryFilterKey, "ALL">]
                        : null;

                return (
                    <GameListItem
                        key={game.gameId}
                        orderNumber={game.orderNumber}
                        title={game.gameName}
                        subtitle={
                            <span className="flex items-center gap-2 flex-wrap">
                                {catStyle && (
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-none ${catStyle.badge}`}
                                    >
                                        {game.category}
                                    </span>
                                )}
                                {game.completedAt && (
                                    <span>
                                        완료일:{" "}
                                        {new Date(game.completedAt).toLocaleDateString("ko-KR")}
                                    </span>
                                )}
                            </span>
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
                );
            })}
        </GameListModal>
    );
}
