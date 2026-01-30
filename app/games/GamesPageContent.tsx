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

export default function GamesPageContent() {
    const searchParams = useSearchParams();

    const { data, mutate } = useSWR("/api/games", fetcher);
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
            <PageHeader title="사건 수색" description="입맛에 맞는 사건 뒤지기" />

            {/* 검색 바: 입력 필드 + 검색 버튼 */}
            <div className="mt-section flex">
                <input
                    type="text"
                    placeholder="게임 이름, 제작사, 시리즈로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-[50px] border border-head-border bg-head-white px-4 text-gray-500 placeholder:text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent"
                />
                <button
                    type="button"
                    className="shrink-0 h-[50px] font-extrabold bg-head-accent-brown text-white px-5 text-lg hover:opacity-90 transition-opacity"
                >
                    검색
                </button>
            </div>

            {/* 게임 목록 헤더 */}
            <div className="mt-section flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-head-text">
                    게임 목록 ({filteredGames.length})
                </h2>
                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary px-3 py-1.5 text-sm"
                >
                    게임 추가
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
