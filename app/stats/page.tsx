"use client";

import { PlayerStats } from "@/types";
import { useEffect, useState } from "react";

export default function StatsPage() {
    const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
    const [gameStats, setGameStats] = useState<any[]>([]);
    const [companyStats, setCompanyStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/stats");
            const data = await res.json();
            setPlayerStats(data.stats.players || []);
            setGameStats(data.stats.games || []);
            setCompanyStats(data.stats.companies || []);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 gradient-text">통계</h1>
                <p className="text-xl text-gray-600">참가자별 완료율과 게임별 통계를 확인하세요</p>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">참가자별 졸업률</h2>
                </div>
                <div className="glass-effect p-6 rounded-2xl shadow-xl">
                    <div className="space-y-6">
                        {playerStats.map((stat) => (
                            <div
                                key={stat.player_id}
                                className="border-b border-gray-200/50 pb-6 last:border-0 last:pb-0"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-lg text-gray-800">
                                        {stat.player_name}
                                    </span>
                                    <span className="text-2xl font-bold gradient-text">
                                        {stat.completion_rate.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden shadow-inner">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 shadow-lg"
                                        style={{ width: `${stat.completion_rate}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-blue-600">
                                        {stat.completed_count}
                                    </span>{" "}
                                    / {stat.total_games} 완료
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🎮</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">게임별 완료율 (낮은 순)</h2>
                </div>
                <div className="glass-effect p-6 rounded-2xl shadow-xl">
                    <div className="space-y-4">
                        {gameStats.slice(0, 20).map((stat: any) => (
                            <div
                                key={stat.id}
                                className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 hover:border-blue-300 hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 mb-1">
                                            {stat.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-green-600">
                                                {stat.completed_count}
                                            </span>{" "}
                                            / {stat.total_players} 완료
                                        </p>
                                    </div>
                                    <span className="text-xl font-bold gradient-text ml-4">
                                        {parseFloat(stat.completion_rate).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🏢</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">제작사별 통계</h2>
                </div>
                <div className="glass-effect p-6 rounded-2xl shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {companyStats.map((stat: any) => (
                            <div
                                key={stat.company}
                                className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-gray-200/50 hover:border-purple-300 hover:shadow-lg transition-all card-hover"
                            >
                                <h3 className="font-bold text-lg text-gray-800 mb-3">
                                    {stat.company}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-semibold">게임 수:</span>{" "}
                                        <span className="text-purple-600 font-bold">
                                            {stat.game_count}개
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">총 완료 횟수:</span>{" "}
                                        <span className="text-green-600 font-bold">
                                            {stat.total_completions}회
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
