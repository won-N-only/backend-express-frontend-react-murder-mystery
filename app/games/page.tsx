"use client";

import useSWR from "swr";

interface Game {
    _id: string;
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers?: number | null;
    company?: string | null;
    series?: string | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function GamesPage() {
    const { data } = useSWR("/api/games", fetcher);
    const games: Game[] = data?.games ?? [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">게임 목록 ({games.length})</h1>
            <div className="space-y-3">
                {games.map((g) => (
                    <div key={g._id} className="rounded-xl bg-white/80 shadow px-4 py-3 flex justify-between">
                        <div>
                            <div className="text-sm text-slate-500">#{g.orderNumber}</div>
                            <div className="font-semibold">{g.name}</div>
                            <div className="text-xs text-slate-500">
                                {g.minPlayers}
                                {g.maxPlayers ? `-${g.maxPlayers}` : "+"}인
                                {g.company && ` · ${g.company}`}
                                {g.series && ` · ${g.series}`}
                            </div>
                        </div>
                        <a
                            href={`/games/${g._id}`}
                            className="self-center text-xs text-blue-600 hover:underline"
                        >
                            상세
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

