"use client";

import PageHeader from "@app/components/common/PageHeader";
import GameForm, { formDataToPayload } from "@app/components/pages/games/GameForm";
import { fetcher } from "@app/lib/fetcher";
import type { Game } from "@app/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function EditGamePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;
    const { data, isLoading } = useSWR<{ game: Game }>(id ? `/api/games/${id}` : null, fetcher);
    const game = data?.game;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (payload: ReturnType<typeof formDataToPayload>) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/games/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err?.error ?? "수정에 실패했습니다.");
                return;
            }
            router.push(`/games/${id}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !game) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader title="게임 수정" description={`${game.name} 정보를 수정합니다.`} />
            <GameForm
                initialGame={game}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="저장"
            />
            <p className="text-sm text-head-gray-500">
                <Link href={`/games/${id}`} className="text-head-brown hover:underline">
                    ← 게임 상세로
                </Link>
            </p>
        </div>
    );
}
