"use client";

import PageHeader from "@app/components/common/PageHeader";
import AddGameModal from "@app/components/pages/games/AddGameModal";
import GameCard from "@app/components/pages/games/GameCard";
import GameModal from "@app/components/pages/games/GameModal";
import { useScrollRestore } from "@app/hooks/useScrollRestore";
import { fetcher } from "@app/lib/fetcher";
import type { Game } from "@app/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

type PlayerFilterKey = "all" | "1-2" | "3-4" | "5-6" | "7+";

type CategoryFilterKey = "all" | "오프라인" | "크라임씬" | "온라인/미정발" | "우즈/리얼월드";

const PLAYER_FILTERS: { key: PlayerFilterKey; label: string }[] = [
    { key: "all", label: "전체 인원" },
    { key: "1-2", label: "1-2인" },
    { key: "3-4", label: "3-4인" },
    { key: "5-6", label: "5-6인" },
    { key: "7+", label: "7인 이상" },
];

const CATEGORY_FILTERS: { key: CategoryFilterKey; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "오프라인", label: "오프라인" },
    { key: "크라임씬", label: "크라임씬" },
    { key: "온라인/미정발", label: "온라인/미정발" },
    { key: "우즈/리얼월드", label: "우즈/리얼월드" },
];

export default function GamesPageContent() {
    const searchParams = useSearchParams();

    const [playerFilter, setPlayerFilter] = useState<PlayerFilterKey>("all");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilterKey>("all");

    const apiPath = useMemo(() => {
        const params = new URLSearchParams();
        switch (playerFilter) {
            case "1-2":
                params.set("minPlayers", "1");
                params.set("maxPlayers", "2");
                break;
            case "3-4":
                params.set("minPlayers", "3");
                params.set("maxPlayers", "4");
                break;
            case "5-6":
                params.set("minPlayers", "5");
                params.set("maxPlayers", "6");
                break;
            case "7+":
                params.set("minPlayers", "7");
                break;
            case "all":
            default:
                break;
        }

        if (categoryFilter !== "all") {
            params.set("category", categoryFilter);
        }
        const qs = params.toString();
        return `/api/games${qs ? `?${qs}` : ""}`;
    }, [playerFilter, categoryFilter]);

    const { data, mutate } = useSWR(apiPath, fetcher);
    const games = useMemo(() => (data?.games ?? []) as Game[], [data?.games]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const id =
            searchParams.get("gameId") ??
            (typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get("gameId")
                : null);
        if (id) setSelectedGameId(id);
    }, [searchParams]);

    const closeGameModal = useCallback(() => {
        setSelectedGameId(null);
        if (
            typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("gameId")
        ) {
            window.history.replaceState(null, "", "/games");
        }
    }, []);

    useScrollRestore([games.length]);

    const filteredGames = useMemo(() => {
        if (!searchQuery.trim()) return games;
        const query = searchQuery.toLowerCase().trim();
        return games.filter(
            (game) =>
                game.name.toLowerCase().includes(query) ||
                game.company?.toLowerCase().includes(query) ||
                game.series?.toLowerCase().includes(query),
        );
    }, [games, searchQuery]);

    return (
        <>
            <PageHeader title="게임 목록" description="할 수 있는 모든 게임을 둘러보세요 " />

            {/* 검색 바: 입력 필드 + 검색 버튼 */}
            <div className="mt-section">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="게임 이름, 제작사, 시리즈로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 h-[50px] bg-head-white px-4 text-gray-500 placeholder:text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent"
                    />
                    <button
                        type="button"
                        className="shrink-0 bg-head-accent-brown text-white text-sm md:text-lg hover:opacity-90 transition-opacity btn-standard-padding"
                    >
                        검색
                    </button>
                </div>

                {/* 인원 수 칩 필터 */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {PLAYER_FILTERS.map((filter) => {
                        const isActive = filter.key === playerFilter;
                        return (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() => setPlayerFilter(filter.key)}
                                className={`px-3 py-1.5 text-xs md:text-sm   transition ${
                                    isActive
                                        ? "bg-head-text text-white   shadow-sm"
                                        : "bg-head-white text-head-text   hover:bg-head-gray-100"
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>

                {/* 게임 카테고리 칩 필터 */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {CATEGORY_FILTERS.map((filter) => {
                        const isActive = filter.key === categoryFilter;
                        return (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() => setCategoryFilter(filter.key)}
                                className={`px-3 py-1.5 text-xs md:text-sm transition ${
                                    isActive
                                        ? "bg-head-text text-white shadow-sm"
                                        : "bg-head-white text-head-text hover:bg-head-gray-100"
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 게임 목록 헤더 */}
            <div className="mt-section flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-head-text">
                    게임 목록 ({filteredGames.length})
                </h2>
                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary text-sm"
                >
                    게임추가
                </button>
            </div>

            <div className="mt-subtitle">
                {/* 카드 그리드 */}
                {filteredGames.length === 0 && searchQuery.trim() !== "" ? (
                    <div className="text-center py-12 text-head-text">
                        <Image
                            src="/sad_head.png"
                            alt="sad head"
                            width={600}
                            height={600}
                            className="w-20 h-22 mx-auto"
                        />
                        <p className="text-xl mt-4">그런 머미는 없어요 ㅠ.ㅠ</p>
                        <p className="text-md mt-1">다시 입력해주세요</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredGames.map((g) => (
                            <GameCard
                                key={g._id}
                                game={g}
                                onClick={() => setSelectedGameId(g._id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <GameModal gameId={selectedGameId} onClose={closeGameModal} />
            <AddGameModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => mutate()}
            />
        </>
    );
}
