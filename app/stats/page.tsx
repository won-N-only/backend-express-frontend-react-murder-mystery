"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StatsPage() {
    const { data } = useSWR("/api/stats", fetcher);
    const stats = data?.stats ?? {};
    const players = stats.players ?? [];
    const games = stats.games ?? [];
    const companies = stats.companies ?? [];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">통계</h1>

            <section className="space-y-3">
                <h2 className="font-semibold">참가자별 졸업률</h2>
                <div className="rounded-2xl bg-white/80 shadow p-4 space-y-3">
                    {players.map((p: any) => (
                        <div key={p.playerId} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>{p.playerName}</span>
                                <span className="font-semibold text-blue-600">
                                    {p.completionRate.toFixed(1)}% ({p.completedCount}/{p.totalGames})
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                                <div
                                    className="h-2 rounded-full bg-blue-500"
                                    style={{ width: `${Math.min(100, p.completionRate)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="font-semibold">게임별 완료율 (낮은 순)</h2>
                <div className="rounded-2xl bg-white/80 shadow p-4 space-y-2">
                    {games.slice(0, 20).map((g: any) => (
                        <div key={g.id} className="flex justify-between text-sm">
                            <span>{g.name}</span>
                            <span className="text-slate-600">
                                {g.completedCount}/{g.totalPlayers} ({g.completionRate.toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="font-semibold">제작사별 요약</h2>
                <div className="grid gap-3 md:grid-cols-2">
                    {companies.map((c: any) => (
                        <div key={c.company} className="rounded-xl bg-white/80 shadow px-4 py-3 text-sm">
                            <div className="font-semibold mb-1">{c.company}</div>
                            <div>게임 수: {c.gameCount}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

