"use client";

import GameCard from "@/components/GameCard";
import { Game } from "@/types";
import { useEffect, useState } from "react";

export default function GamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCompany, setFilterCompany] = useState("");
    const [filterPlayers, setFilterPlayers] = useState("");

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/games");
            const data = await res.json();
            setGames(data.games || []);
        } catch (error) {
            console.error("Failed to fetch games:", error);
        } finally {
            setLoading(false);
        }
    };

    const companies = Array.from(
        new Set(
            games.map((g) => g.company).filter((company): company is string => company !== null),
        ),
    );

    const filteredGames = games.filter((game) => {
        if (searchTerm && !game.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (filterCompany && game.company !== filterCompany) {
            return false;
        }
        if (filterPlayers) {
            const [min, max] = filterPlayers.split("-").map(Number);
            if (max) {
                if (game.min_players > max || (game.max_players && game.max_players < min)) {
                    return false;
                }
            } else {
                if (game.min_players !== min) {
                    return false;
                }
            }
        }
        return true;
    });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">로딩 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-4 gradient-text">게임 목록</h1>
                <p className="text-xl text-gray-600">
                    총 <span className="font-bold text-blue-600">{filteredGames.length}개</span>의
                    게임
                </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            🔍 검색
                        </label>
                        <input
                            type="text"
                            placeholder="게임명 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            🏢 제작사
                        </label>
                        <select
                            value={filterCompany}
                            onChange={(e) => setFilterCompany(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                            <option value="">전체</option>
                            {companies.map((company) => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            👥 인원 수
                        </label>
                        <select
                            value={filterPlayers}
                            onChange={(e) => setFilterPlayers(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                            <option value="">전체</option>
                            <option value="2">2인</option>
                            <option value="3-4">3-4인</option>
                            <option value="4">4인</option>
                            <option value="4-5">4-5인</option>
                            <option value="5">5인</option>
                            <option value="5-6">5-6인</option>
                            <option value="6">6인</option>
                            <option value="6-8">6-8인</option>
                            <option value="7-9">7-9인</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} showDetails />
                ))}
            </div>

            {filteredGames.length === 0 && (
                <div className="glass-effect p-12 rounded-2xl shadow-xl text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-gray-600 font-medium">조건에 맞는 게임이 없습니다</p>
                    <p className="text-gray-500 mt-2">다른 필터를 시도해보세요</p>
                </div>
            )}
        </div>
    );
}
