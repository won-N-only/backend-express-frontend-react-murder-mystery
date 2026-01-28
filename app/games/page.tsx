"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import GameCard from "../components/GameCard";
import { useScrollRestore } from "../hooks/useScrollRestore";
import { fetcher } from "../lib/fetcher";
import type { Game } from "../types";

export default function GamesPage() {
    const { data } = useSWR("/api/games", fetcher);
    const games: Game[] = data?.games ?? [];
    const [searchQuery, setSearchQuery] = useState("");

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">게임 목록 ({filteredGames.length})</h1>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="게임 이름, 제작사, 시리즈로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                )}
            </div>

            {filteredGames.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <p className="text-lg">검색 결과가 없습니다.</p>
                    <p className="text-sm mt-1">다른 검색어를 시도해보세요.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGames.map((g) => (
                        <GameCard key={g._id} game={g} />
                    ))}
                </div>
            )}
        </div>
    );
}
