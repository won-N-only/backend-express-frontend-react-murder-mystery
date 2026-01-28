"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { CompletionStatus, CompletionStatusLabel } from "@completion/domain/valueObjects/CompletionStatus";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function GameDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data, mutate } = useSWR(id ? `/api/games/${id}` : null, fetcher);
    const { data: playersData } = useSWR("/api/players", fetcher);

    const game = data?.game;
    const completions = data?.completions ?? [];
    const players = playersData?.players ?? [];

    const completionMap = new Map<string, CompletionStatus>(
        completions.map((c: any) => [c.playerId as string, c.status as CompletionStatus]),
    );

    const updateStatus = async (playerId: string, status: CompletionStatus) => {
        await fetch(`/api/games/${id}/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId, status }),
        });
        mutate();
    };

    if (!game) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <div className="text-sm text-slate-500">#{game.orderNumber}</div>
                <h1 className="text-2xl font-bold">{game.name}</h1>
                <div className="text-xs text-slate-500">
                    {game.minPlayers}
                    {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                    {game.company && ` · ${game.company}`}
                    {game.series && ` · ${game.series}`}
                </div>
            </div>

            <section className="rounded-2xl bg-white/80 shadow p-6 space-y-4">
                <h2 className="font-semibold">참가자별 완료 상태</h2>
                <div className="space-y-2">
                    {players.map((p: any) => {
                        const status = completionMap.get(p._id) ?? CompletionStatus.X;
                        const statuses = [
                            CompletionStatus.DONE,
                            CompletionStatus.X,
                            CompletionStatus.PLANNED,
                            CompletionStatus.ERROR,
                        ] as const;
                        return (
                            <div
                                key={p._id}
                                className="flex items-center justify-between rounded-lg border bg-white/80 px-3 py-2"
                            >
                                <span className="text-sm font-medium">{p.name}</span>
                                <div className="flex gap-1">
                                    {statuses.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => updateStatus(p._id, s)}
                                            className={`px-2 py-1 text-xs rounded ${
                                                status === s
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {CompletionStatusLabel[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
