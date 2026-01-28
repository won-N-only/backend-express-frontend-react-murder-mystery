"use client";

import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { useParams } from "next/navigation";
import useSWR from "swr";
import CompletionStatusButtons from "../../components/CompletionStatusButtons";
import GameInfo from "../../components/GameInfo";
import { fetcher } from "../../lib/fetcher";
import type { Game, Player } from "../../types";

export default function GameDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const {
        data,
        mutate,
        isLoading: isLoadingGame,
    } = useSWR(id ? `/api/games/${id}` : null, fetcher);
    const { data: playersData, isLoading: isLoadingPlayers } = useSWR("/api/players", fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const game: Game | undefined = data?.game;
    const completions = data?.completions ?? [];
    const players: Player[] = playersData?.players ?? [];

    const completionMap = new Map<string, CompletionStatus>(
        completions.map((c: any) => [c.playerId as string, c.status as CompletionStatus]),
    );

    const updateStatus = async (playerId: string, status: CompletionStatus) => {
        try {
            const response = await fetch(`/api/games/${id}/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, status }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Failed to update status:", error);
                return;
            }

            mutate();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (isLoadingGame || !game) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <GameInfo game={game} />

            <section className="rounded-2xl bg-white/80 shadow p-6 space-y-4">
                <h2 className="font-semibold">참가자별 완료 상태</h2>
                <div className="space-y-2">
                    {players.map((p) => {
                        const status = completionMap.get(p._id) ?? CompletionStatus.NOT_DONE;
                        return (
                            <div
                                key={p._id}
                                className="flex items-center justify-between rounded-lg border bg-white/80 px-3 py-2"
                            >
                                <span className="text-sm font-medium">{p.name}</span>
                                <CompletionStatusButtons
                                    currentStatus={status}
                                    onStatusChange={(s) => updateStatus(p._id, s)}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
