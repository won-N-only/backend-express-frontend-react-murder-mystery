"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Player {
    id: number;
    name: string;
}

interface Game {
    id: number;
    name: string;
    min_players: number;
    max_players: number | null;
    company: string | null;
}

export default function Home() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [playerCount, setPlayerCount] = useState<number>(4);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await fetch("/api/players");
            const data = await res.json();
            setPlayers(data.players || []);
        } catch (error) {
            console.error("Failed to fetch players:", error);
        }
    };

    const handlePlayerToggle = (playerId: number) => {
        setSelectedPlayers((prev) =>
            prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId],
        );
    };

    const handleMatch = async () => {
        if (selectedPlayers.length === 0) {
            alert("최소 1명의 참가자를 선택해주세요.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player_ids: selectedPlayers,
                    player_count: playerCount,
                }),
            });
            const data = await res.json();
            setMatches(data.matches || []);
        } catch (error) {
            console.error("Failed to find matches:", error);
            alert("매칭 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 gradient-text">게임 매칭</h1>
                <p className="text-xl text-gray-600">
                    참가자와 인원 수를 선택하면 최적의 게임을 추천해드립니다
                </p>
            </div>

            {/* Player Selection Card */}
            <div className="glass-effect p-8 rounded-2xl shadow-xl mb-8 card-hover">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">👥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">참가자 선택</h2>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
                    {players.map((player) => (
                        <label
                            key={player.id}
                            className={`relative p-4 rounded-xl cursor-pointer text-center font-medium transition-all duration-200 transform ${
                                selectedPlayers.includes(player.id)
                                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedPlayers.includes(player.id)}
                                onChange={() => handlePlayerToggle(player.id)}
                                className="hidden"
                            />
                            {player.name}
                            {selectedPlayers.includes(player.id) && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-blue-500 text-xs">✓</span>
                                </span>
                            )}
                        </label>
                    ))}
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <label className="flex items-center gap-3 text-gray-700 font-medium">
                        <span className="text-lg">인원 수:</span>
                        <input
                            type="number"
                            min="2"
                            max="10"
                            value={playerCount}
                            onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                            className="w-24 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold"
                        />
                        <span className="text-gray-500">명</span>
                    </label>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="text-sm text-gray-500">
                        선택된 참가자:{" "}
                        <span className="font-bold text-blue-600">{selectedPlayers.length}명</span>
                    </div>
                </div>

                <button
                    onClick={handleMatch}
                    disabled={loading || selectedPlayers.length === 0}
                    className="btn-primary w-full text-lg"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⚙️</span>
                            매칭 중...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>🎯</span>
                            게임 매칭하기
                        </span>
                    )}
                </button>
            </div>

            {/* Match Results */}
            {matches.length > 0 && (
                <div className="glass-effect p-8 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            추천 게임 <span className="text-blue-600">({matches.length}개)</span>
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {matches.slice(0, 10).map((game, index) => (
                            <div
                                key={game.id}
                                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg font-bold text-sm shadow-md">
                                                {index + 1}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {game.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                {game.min_players}
                                                {game.max_players ? `-${game.max_players}` : "+"}인
                                            </span>
                                            {game.company && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                    {game.company}
                                                </span>
                                            )}
                                        </div>
                                        {game.incomplete_players &&
                                            game.incomplete_players.length > 0 && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                        미완료
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        {game.incomplete_players.join(", ")}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                    <Link
                                        href={`/games/${game.id}`}
                                        className="btn-secondary text-sm px-4 py-2"
                                    >
                                        상세보기 →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/games"
                    className="glass-effect p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group card-hover"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">게임 목록</h3>
                    <p className="text-gray-600">모든 게임을 한눈에 확인하세요</p>
                </Link>
                <Link
                    href="/match"
                    className="glass-effect p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group card-hover"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">고급 매칭</h3>
                    <p className="text-gray-600">상세 옵션으로 정확한 매칭</p>
                </Link>
                <Link
                    href="/stats"
                    className="glass-effect p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group card-hover"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-3xl">📊</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">통계</h3>
                    <p className="text-gray-600">참가자별 완료율 확인</p>
                </Link>
            </div>
        </div>
    );
}
