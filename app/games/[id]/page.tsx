"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 게임 상세는 항상 /games?gameId=xxx 모달로 통일.
 * /games/[id] 직접 접근 시 리다이렉트.
 */
export default function GameDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;

    useEffect(() => {
        if (id) router.replace(`/games?gameId=${id}`);
    }, [id, router]);

    return (
        <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">이동 중...</div>
        </div>
    );
}
