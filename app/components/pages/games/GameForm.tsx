"use client";

import type { Game } from "@app/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface GameFormData {
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers: string;
    company: string;
    series: string;
    ownerNote: string;
    thumbnail: string;
    description: string;
}

function gameToFormData(game: Game | null): GameFormData {
    if (!game) {
        return {
            orderNumber: 1,
            name: "",
            minPlayers: 2,
            maxPlayers: "",
            company: "",
            series: "",
            ownerNote: "",
            thumbnail: "",
            description: "",
        };
    }
    return {
        orderNumber: game.orderNumber ?? 1,
        name: game.name ?? "",
        minPlayers: game.minPlayers ?? 2,
        maxPlayers: game.maxPlayers != null ? String(game.maxPlayers) : "",
        company: game.company ?? "",
        series: game.series ?? "",
        ownerNote: Array.isArray(game.ownerNote) ? game.ownerNote.join("\n") : "",
        thumbnail: game.thumbnail ?? "",
        description: game.description ?? "",
    };
}

export function formDataToPayload(data: GameFormData) {
    const ownerNoteTrimmed = data.ownerNote
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
    return {
        orderNumber: Number(data.orderNumber) || 1,
        name: data.name.trim(),
        minPlayers: Number(data.minPlayers) || 2,
        maxPlayers: data.maxPlayers.trim() ? Number(data.maxPlayers) || null : null,
        company: data.company.trim() || null,
        series: data.series.trim() || null,
        ownerNote: ownerNoteTrimmed.length > 0 ? ownerNoteTrimmed : null,
        thumbnail: data.thumbnail.trim() || null,
        description: data.description.trim() || null,
    };
}

interface GameFormProps {
    initialGame?: Game | null;
    onSubmit: (payload: ReturnType<typeof formDataToPayload>) => Promise<void>;
    isSubmitting: boolean;
    submitLabel: string;
}

const inputClass =
    "border border-head-border text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent  h-[40px]";
const labelClass = "block text-base font-semibold text-head-text";

/**
 * 게임 수정  페이지
 */
export default function GameForm({
    initialGame,
    onSubmit,
    isSubmitting,
    submitLabel,
}: GameFormProps) {
    const [form, setForm] = useState<GameFormData>(() => gameToFormData(initialGame ?? null));
    const router = useRouter();

    useEffect(() => {
        if (initialGame) setForm(gameToFormData(initialGame));
    }, [initialGame]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formDataToPayload(form));
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-head-main   w-full max-w-[750px] mx-auto py-[30px] space-y-[20px]"
        >
            <div className="space-y-[20px]">
                {/* 게임명 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[20px]">
                    <label htmlFor="name" className={`${labelClass} font-semibold sm:w-[120px]`}>
                        * 게임명
                    </label>
                    <input
                        id="name"
                        className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="머더 미스터리 시리즈 01"
                    />
                </div>
                {/* 최소/최대 인원 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                    <div className="flex items-center">
                        <label
                            htmlFor="minPlayers"
                            className={`${labelClass} mr-5 font-semibold w-[120px] shrink-0`}
                        >
                            * 최소 인원
                        </label>
                        <input
                            id="minPlayers"
                            type="number"
                            min={1}
                            value={form.minPlayers}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    minPlayers: Number(e.target.value) || 1,
                                }))
                            }
                            className={`${inputClass} w-full sm:w-[215px] px-4 text-sm`}
                        />
                    </div>

                    <div className="flex items-center">
                        <label
                            htmlFor="maxPlayers"
                            className={`${labelClass} mr-2 font-semibold w-[120px] shrink-0`}
                        >
                            * 최대 인원
                        </label>
                        <input
                            id="maxPlayers"
                            type="number"
                            min={1}
                            value={form.maxPlayers}
                            onChange={(e) => setForm((p) => ({ ...p, maxPlayers: e.target.value }))}
                            className={`${inputClass} w-full sm:w-[215px] px-4 text-sm`}
                            placeholder="6"
                        />
                    </div>
                </div>
                {/* 제작사 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-[20px]">
                    <label htmlFor="company" className={`${labelClass} font-semibold sm:w-[120px]`}>
                        * 제작사
                    </label>
                    <input
                        id="company"
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                        className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                        placeholder="언더독 게임즈"
                    />
                </div>
                {/* 시리즈 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-[20px]">
                    <label htmlFor="series" className={`${labelClass} font-semibold sm:w-[120px]`}>
                        * 시리즈
                    </label>
                    <input
                        id="series"
                        type="text"
                        value={form.series}
                        onChange={(e) => setForm((p) => ({ ...p, series: e.target.value }))}
                        className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                        placeholder="미스터리 파티 시리즈"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-[20px]">
                    <label
                        htmlFor="thumbnail"
                        className={`${labelClass} font-semibold sm:w-[120px]`}
                    >
                        썸네일 URL
                    </label>
                    <input
                        id="thumbnail"
                        type="url"
                        value={form.thumbnail}
                        onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))}
                        className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                        placeholder="https://..."
                    />
                </div>
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>
                    * 시놉시스
                </label>
                <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className={`${inputClass} w-full h-[110px] mt-2`}
                    placeholder="게임 소개 또는 시놉시스"
                />
            </div>
            <div>
                <label htmlFor="ownerNote" className={labelClass}>
                    소유자 (엔터로 구분)
                </label>
                <textarea
                    id="ownerNote"
                    value={form.ownerNote}
                    onChange={(e) => setForm((p) => ({ ...p, ownerNote: e.target.value }))}
                    className={`${inputClass} w-full h-[80px] mt-2`}
                    placeholder="소유자, 엔터로 구분"
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-3">
                <button type="submit" disabled={isSubmitting} className="btn-primary px-4 py-2">
                    {isSubmitting ? "저장 중..." : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-500 hover:underline"
                >
                    취소
                </button>
            </div>
        </form>
    );
}
