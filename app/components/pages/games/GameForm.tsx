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
    /**
     * 게임 카테고리 코드 (0~4)
     * 0: 선택 안함, 1:오프라인, 2:크라임씬, 3:온라인/미정발, 4:우즈/리얼월드
     */
    category: string;
    owners: string;
    thumbnail: string;
    description: string;
}

function gameCategoryLabelToCode(category: string | null | undefined): string {
    switch (category) {
        case "오프라인":
            return "1";
        case "크라임씬":
            return "2";
        case "온라인/미정발":
            return "3";
        case "우즈/리얼월드":
            return "4";
        default:
            return "0";
    }
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
            category: "0",
            owners: "",
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
        category: gameCategoryLabelToCode(game.category),
        owners: Array.isArray(game.owners) ? game.owners.join(", ") : "",
        thumbnail: game.thumbnail ?? "",
        description: game.description ?? "",
    };
}

export function formDataToPayload(data: GameFormData) {
    const categoryCode = data.category.trim() ? Number(data.category.trim()) : 0;
    const category = categoryCode === 0 || Number.isNaN(categoryCode) ? null : categoryCode;

    const ownersTrimmed = categoryCode === 1
        ? data.owners.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
        : [];

    return {
        orderNumber: Number(data.orderNumber) || 1,
        name: data.name.trim(),
        minPlayers: Number(data.minPlayers) || 2,
        maxPlayers: data.maxPlayers.trim() ? Number(data.maxPlayers) || null : null,
        company: data.company.trim() || null,
        series: data.series.trim() || null,
        category,
        owners: ownersTrimmed.length > 0 ? ownersTrimmed : null,
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
    "border border-head-border text-head-text text-lg focus:outline-none p-[10px] focus:ring-2 focus:ring-head-brown focus:border-transparent  ";
const labelClass = "block text-base font-bold text-head-text";
const textareaClass =
    "border border-head-border  text-lg text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent";
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
                <div className="flex flex-col md:flex-row md:items-center gap-[10px] md:gap-[20px]">
                    <label htmlFor="name" className={`${labelClass} font-bold md:w-[120px]`}>
                        * 게임명
                    </label>
                    <input
                        id="name"
                        className={`${inputClass} w-full md:w-[570px] `}
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="머더 미스터리 시리즈 01"
                    />
                </div>
                {/* 최소/최대 인원 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                    <div className="flex items-center">
                        <label
                            htmlFor="minPlayers"
                            className={`${labelClass} md:mr-5 mr-2 font-bold w-[120px] shrink-0`}
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
                            className={`${inputClass} w-full md:w-[215px] px-4`}
                        />
                    </div>

                    <div className="flex items-center">
                        <label
                            htmlFor="maxPlayers"
                            className={`${labelClass} mr-2 font-bold w-[120px] shrink-0`}
                        >
                            * 최대 인원
                        </label>
                        <input
                            id="maxPlayers"
                            type="number"
                            min={1}
                            value={form.maxPlayers}
                            onChange={(e) => setForm((p) => ({ ...p, maxPlayers: e.target.value }))}
                            className={`${inputClass} w-full md:w-[215px] px-4`}
                            placeholder="6"
                        />
                    </div>
                </div>
                {/* 제작사 */}
                <div className="flex flex-col md:flex-row md:items-center gap-[20px]">
                    <label htmlFor="company" className={`${labelClass} font-bold md:w-[120px]`}>
                        * 제작사
                    </label>
                    <input
                        id="company"
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                        className={`${inputClass} w-full md:w-[570px] px-4`}
                        placeholder="언더독 게임즈"
                    />
                </div>
                {/* 시리즈 */}
                <div className="flex flex-col md:flex-row md:items-center gap-[20px]">
                    <label htmlFor="series" className={`${labelClass} font-bold md:w-[120px]`}>
                        * 시리즈
                    </label>
                    <input
                        id="series"
                        type="text"
                        value={form.series}
                        onChange={(e) => setForm((p) => ({ ...p, series: e.target.value }))}
                        className={`${inputClass} w-full md:w-[570px] px-4`}
                        placeholder="미스터리 파티 시리즈"
                    />
                </div>
                {/* 게임 종류 */}
                <div className="flex flex-col md:flex-row md:items-center gap-[20px]">
                    <label htmlFor="category" className={`${labelClass} font-bold md:w-[120px]`}>
                        * 게임 종류
                    </label>
                    <select
                        id="category"
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className={`${inputClass} w-full md:w-[570px] px-4 text-sm`}
                    >
                        <option value="0">선택 안함</option>
                        <option value="1">오프라인</option>
                        <option value="2">크라임씬</option>
                        <option value="3">온라인/미정발</option>
                        <option value="4">우즈/리얼월드</option>
                    </select>
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
                    className={`${textareaClass} w-full h-[120px] mt-2 p-2 text-md`}
                    placeholder="게임 소개 또는 시놉시스"
                />{" "}
            </div>
            {form.category === "1" && (
                <div>
                    <label htmlFor="owners" className={labelClass}>
                        소장자
                    </label>
                    <textarea
                        id="owners"
                        value={form.owners}
                        onChange={(e) => setForm((p) => ({ ...p, owners: e.target.value }))}
                        className={`${textareaClass} w-full mt-2`}
                        placeholder="감독, 귤젤리, 콩난"
                    />
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-[10px] md:gap-3">
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? "저장 중..." : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-standard-padding text-gray-500 hover:underline"
                >
                    취소
                </button>
            </div>
        </form>
    );
}
