"use client";

import PlayerSelector from "@/components/PlayerSelector";
import { MatchResult, Player } from "@/types";
import { useEffect, useState } from "react";

export default function MatchPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [playerCount, setPlayerCount] = useState<number>(4);
    const [matches, setMatches] = useState<MatchResult[]>([]);
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
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 gradient-text">게임 매칭</h1>
                <p className="text-xl text-gray-600">
                    참가자와 인원 수를 선택하면 최적의 게임을 추천해드립니다
                </p>
            </div>

            <div className="glass-effect p-8 rounded-2xl shadow-xl mb-8 card-hover">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">👥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">참가자 선택</h2>
                </div>

                <PlayerSelector
                    players={players}
                    selectedIds={selectedPlayers}
                    onToggle={handlePlayerToggle}
                />

                <div className="flex items-center gap-4 mt-6 mb-6">
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
                        {matches.map((game, index) => (
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
                                            {game.series && (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                                    {game.series}
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
                                        <p className="text-xs text-gray-500 mt-2">
                                            매칭 점수:{" "}
                                            <span className="font-semibold">
                                                {Math.round(game.match_score)}
                                            </span>
                                        </p>
                                    </div>
                                    <a
                                        href={`/games/${game.id}`}
                                        className="btn-secondary text-sm px-4 py-2"
                                    >
                                        상세보기 →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
