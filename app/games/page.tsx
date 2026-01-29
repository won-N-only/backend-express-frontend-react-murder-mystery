"use client";

import PageHeader from "@app/components/common/PageHeader";
import GameCard from "@app/components/pages/games/GameCard";
import GameModal from "@app/components/pages/games/GameModal";
import { useScrollRestore } from "@app/hooks/useScrollRestore";
import { fetcher } from "@app/lib/fetcher";
import type { Game } from "@app/types";
import Image from "next/image";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function GamesPage() {
    const { data } = useSWR("/api/games", fetcher);
    const games: Game[] = data?.games ?? [];
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

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
            <div className="space-y-6">
                <PageHeader
                    title="사건 수색"
                    description="입맛에 맞는 살인 사건 없나? 당장 추리하고 싶은 사건 뒤지기"
                />

                {/* 검색 바: 입력 필드 + 검색 버튼 */}
                <div className="flex  ">
                    <input
                        type="text"
                        placeholder="게임 이름, 제작사, 시리즈로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1  border border-head-brown bg-head-white px-4 py-2.5 text-head-gray-800 placeholder:text-head-gray-400 focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent"
                    />
                    <button
                        type="button"
                        className="shrink-0  bg-head-accent-brown text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        검색
                    </button>
                </div>

                {/* 게임 목록 헤더 */}
                <h2 className="text-xl font-bold text-head-gray-800">
                    머더 미스터리 목록 ({filteredGames.length})
                </h2>

                {/* 카드 그리드 */}
                {filteredGames.length === 0 && searchQuery.trim() !== "" ? (
                    <div className="text-center py-12 text-head-gray-500">
                        <Image
                            src="/sad_head.png"
                            alt="sad head"
                            width={600}
                            height={600}
                            className="w-20 h-22 mx-auto pb-4"
                        />
                        <p className="text-xl">그런 머미는 없어요 ㅠ.ㅠ</p>
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
            <GameModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)} />
        </>
    );
}
