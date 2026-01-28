"use client";

import useSWR from "swr";
import { useState } from "react";

interface Player {
    _id: string;
    name: string;
}

interface MatchGame {
    _id: string;
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    matchScore: number;
    incompletePlayers: string[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
    const { data: playersData } = useSWR("/api/players", fetcher);
    const players: Player[] = playersData?.players ?? [];

    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [playerCount, setPlayerCount] = useState<number>(4);
    const [matches, setMatches] = useState<MatchGame[]>([]);
    const [loading, setLoading] = useState(false);

    const togglePlayer = (id: string) => {
        setSelectedPlayers((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    };

    const handleMatch = async () => {
        if (!selectedPlayers.length) return;
        setLoading(true);
        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerIds: selectedPlayers, playerCount }),
            });
            const json = await res.json();
            setMatches(json.matches ?? []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <section className="space-y-3 text-center">
                <h1 className="text-3xl md:text-4xl font-bold">빠른 게임 매칭</h1>
                <p className="text-slate-600">함께 할 사람과 인원 수를 선택하면 추천 게임을 보여줍니다.</p>
            </section>

            <section className="rounded-2xl bg-white/80 shadow p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-lg">참가자 선택</h2>
                        <p className="text-sm text-slate-500">시트에 있는 닉네임 기준으로 관리됩니다.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">플레이 인원</span>
                        <input
                            type="number"
                            min={2}
                            max={10}
                            value={playerCount}
                            onChange={(e) => setPlayerCount(parseInt(e.target.value || "2", 10))}
                            className="w-16 rounded border px-2 py-1 text-center"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {players.map((p) => (
                        <button
                            key={p._id}
                            type="button"
                            onClick={() => togglePlayer(p._id)}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                                selectedPlayers.includes(p._id)
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white hover:bg-slate-50"
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleMatch}
                    disabled={loading || !selectedPlayers.length}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold disabled:bg-slate-400"
                >
                    {loading ? "매칭 중..." : "추천 게임 보기"}
                </button>
            </section>

            {matches.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">추천 게임 {matches.length}개</h2>
                    <div className="space-y-3">
                        {matches.slice(0, 10).map((g) => (
                            <div key={g._id} className="rounded-xl bg-white/80 shadow px-4 py-3 flex justify-between">
                                <div>
                                    <div className="font-semibold">{g.name}</div>
                                    <div className="text-xs text-slate-500">
                                        {g.minPlayers}
                                        {g.maxPlayers ? `-${g.maxPlayers}` : "+"}인
                                        {g.company && ` · ${g.company}`}
                                    </div>
                                    {!!g.incompletePlayers.length && (
                                        <div className="mt-1 text-xs text-emerald-700">
                                            미완료: {g.incompletePlayers.join(", ")}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 self-center">점수 {Math.round(g.matchScore)}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

