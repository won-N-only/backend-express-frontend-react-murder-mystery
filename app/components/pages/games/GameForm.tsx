"use client";

import type { Game } from "@app/types";
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
    "w-full border border-head-border rounded-lg px-3 py-2 text-sm text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent mt-1";
const labelClass = "block text-sm font-medium text-head-text";

export default function GameForm({
    initialGame,
    onSubmit,
    isSubmitting,
    submitLabel,
}: GameFormProps) {
    const [form, setForm] = useState<GameFormData>(() => gameToFormData(initialGame ?? null));

    useEffect(() => {
        if (initialGame) setForm(gameToFormData(initialGame));
    }, [initialGame]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formDataToPayload(form));
    };

    const isEdit = !!initialGame;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 section-card">
            <div className={`grid gap-4 ${isEdit ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {!isEdit && (
                    <div>
                        <label htmlFor="orderNumber" className={labelClass}>
                            순번
                        </label>
                        <input
                            id="orderNumber"
                            type="number"
                            min={1}
                            value={form.orderNumber}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, orderNumber: Number(e.target.value) || 1 }))
                            }
                            className={inputClass}
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="name" className={labelClass}>
                        게임명 *
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className={inputClass}
                        placeholder="머더 미스터리 시리즈 01"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="minPlayers" className={labelClass}>
                        최소 인원 *
                    </label>
                    <input
                        id="minPlayers"
                        type="number"
                        min={1}
                        value={form.minPlayers}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, minPlayers: Number(e.target.value) || 1 }))
                        }
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="maxPlayers" className={labelClass}>
                        최대 인원 (비우면 무제한)
                    </label>
                    <input
                        id="maxPlayers"
                        type="number"
                        min={1}
                        value={form.maxPlayers}
                        onChange={(e) => setForm((p) => ({ ...p, maxPlayers: e.target.value }))}
                        className={inputClass}
                        placeholder="6"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="company" className={labelClass}>
                    제작사
                </label>
                <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    className={inputClass}
                    placeholder="언더독 게임즈"
                />
            </div>
            <div>
                <label htmlFor="series" className={labelClass}>
                    시리즈
                </label>
                <input
                    id="series"
                    type="text"
                    value={form.series}
                    onChange={(e) => setForm((p) => ({ ...p, series: e.target.value }))}
                    className={inputClass}
                    placeholder="미스터리 파티 시리즈"
                />
            </div>
            <div>
                <label htmlFor="thumbnail" className={labelClass}>
                    썸네일 URL
                </label>
                <input
                    id="thumbnail"
                    type="url"
                    value={form.thumbnail}
                    onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))}
                    className={inputClass}
                    placeholder="https://..."
                />
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>
                    시놉시스
                </label>
                <textarea
                    id="description"
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className={inputClass}
                    placeholder="게임 소개 또는 시놉시스"
                />
            </div>
            <div>
                <label htmlFor="ownerNote" className={labelClass}>
                    메모 (한 줄씩 또는 쉼표 구분)
                </label>
                <textarea
                    id="ownerNote"
                    rows={2}
                    value={form.ownerNote}
                    onChange={(e) => setForm((p) => ({ ...p, ownerNote: e.target.value }))}
                    className={inputClass}
                />
            </div>
            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary px-4 py-2">
                    {isSubmitting ? "저장 중..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
