"use client";

import PageHeader from "@app/components/common/PageHeader";
import GameForm, { formDataToPayload } from "@app/components/pages/games/GameForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewGamePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (payload: ReturnType<typeof formDataToPayload>) => {
        setIsSubmitting(true);
        try {
            const { orderNumber: _o, ownerNote: _n, ...addPayload } = payload;
            const res = await fetch("/api/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addPayload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err?.error ?? "게임 추가에 실패했습니다.");
                return;
            }
            const { game } = await res.json();
            router.push(`/games/${game._id}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-section">
            <PageHeader title="게임 추가" description="새 머더 미스터리 게임을 등록합니다." />
            <GameForm
                initialGame={null}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="추가하기"
            />
        </div>
    );
}
