"use client";

import { Game, Player } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameDetailPage() {
    const params = useParams();
    const gameId = params.id as string;

    const [game, setGame] = useState<Game | null>(null);
    const [completions, setCompletions] = useState<any[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (gameId) {
            fetchGameDetails();
            fetchPlayers();
        }
    }, [gameId]);

    const fetchGameDetails = async () => {
        try {
            const res = await fetch(`/api/games/${gameId}`);
            const data = await res.json();
            setGame(data.game);
            setCompletions(data.completions || []);
        } catch (error) {
            console.error("Failed to fetch game:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        try {
            const res = await fetch("/api/players");
            const data = await res.json();
            setPlayers(data.players || []);
        } catch (error) {
            console.error("Failed to fetch players:", error);
        }
    };

    const handleStatusUpdate = async (playerId: number, status: string) => {
        try {
            const res = await fetch(`/api/games/${gameId}/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player_id: playerId,
                    status,
                    completed_at: status === "완료" ? new Date().toISOString().split("T")[0] : null,
                }),
            });

            if (res.ok) {
                fetchGameDetails();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("상태 업데이트 실패");
        }
    };

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

    if (!game) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="glass-effect p-12 rounded-2xl shadow-xl text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-xl text-gray-600 font-medium">게임을 찾을 수 없습니다</p>
                </div>
            </div>
        );
    }

    const completionMap = new Map(completions.map((c) => [c.player_id, c.status]));

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 gradient-text">{game.name}</h1>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>

            <div className="glass-effect p-8 rounded-2xl shadow-xl mb-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">ℹ️</span>
                    게임 정보
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                        <p className="text-sm text-gray-600 mb-1">인원</p>
                        <p className="text-xl font-bold text-gray-800">
                            {game.min_players}
                            {game.max_players ? `-${game.max_players}` : "+"}인
                        </p>
                    </div>
                    {game.company && (
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                            <p className="text-sm text-gray-600 mb-1">제작사</p>
                            <p className="text-xl font-bold text-gray-800">{game.company}</p>
                        </div>
                    )}
                    {game.series && (
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                            <p className="text-sm text-gray-600 mb-1">시리즈</p>
                            <p className="text-xl font-bold text-blue-600">{game.series}</p>
                        </div>
                    )}
                    {game.director && (
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                            <p className="text-sm text-gray-600 mb-1">감독</p>
                            <p className="text-xl font-bold text-gray-800">{game.director}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    참가자별 완료 상태
                </h2>
                <div className="space-y-3">
                    {players.map((player) => {
                        const status = completionMap.get(player.id) || "X";
                        const statusConfig = {
                            완료: { bg: "from-green-500 to-emerald-600", text: "text-white" },
                            X: { bg: "from-gray-400 to-gray-500", text: "text-white" },
                            예정: { bg: "from-yellow-500 to-orange-500", text: "text-white" },
                            "에러플💦": { bg: "from-red-500 to-pink-600", text: "text-white" },
                        };
                        const config =
                            statusConfig[status as keyof typeof statusConfig] || statusConfig["X"];

                        return (
                            <div
                                key={player.id}
                                className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 hover:border-blue-300 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-lg text-gray-800">
                                        {player.name}
                                    </span>
                                    <div className="flex gap-2">
                                        {(["완료", "X", "예정", "에러플💦"] as const).map((s) => {
                                            const isActive = status === s;
                                            const btnConfig = statusConfig[s];
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusUpdate(player.id, s)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform ${
                                                        isActive
                                                            ? `bg-gradient-to-r ${btnConfig.bg} ${btnConfig.text} shadow-lg scale-105`
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
