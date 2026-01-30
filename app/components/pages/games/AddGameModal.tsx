"use client";

import type { Game } from "@app/types";
import { useEffect, useState } from "react";

export interface AddGamePayload {
    name: string;
    minPlayers: number;
    maxPlayers: number | null;
    company: string | null;
    series: string | null;
    thumbnail: string | null;
    description: string | null;
}

const inputClass =
    "w-full border border-head-gray-300 rounded-lg px-3 py-2 text-sm text-head-gray-800 focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent";
const labelClass = "block text-sm font-medium text-head-gray-700 mb-1";

interface AddGameModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (game: Game) => void;
}

export default function AddGameModal({ open, onClose, onSuccess }: AddGameModalProps) {
    const [name, setName] = useState("");
    const [minPlayers, setMinPlayers] = useState(2);
    const [maxPlayers, setMaxPlayers] = useState("");
    const [company, setCompany] = useState("");
    const [series, setSeries] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setName("");
        setMinPlayers(2);
        setMaxPlayers("");
        setCompany("");
        setSeries("");
        setThumbnail("");
        setDescription("");
        setError(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const payload: AddGamePayload = {
                name: name.trim(),
                minPlayers: Number(minPlayers) || 2,
                maxPlayers: maxPlayers.trim() ? Number(maxPlayers) || null : null,
                company: company.trim() || null,
                series: series.trim() || null,
                thumbnail: thumbnail.trim() || null,
                description: description.trim() || null,
            };
            const res = await fetch("/api/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.error ?? "게임 추가에 실패했습니다.");
                return;
            }
            onSuccess(data.game);
            handleClose();
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleClose}
        >
            <div
                className="bg-head-white rounded-2xl shadow-soft max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-head-white z-10 p-4 border-b border-head-gray-200 flex-shrink-0 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-head-gray-800">게임 추가</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-head-gray-500 hover:text-head-gray-800 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                    )}
                    <div>
                        <label htmlFor="add-name" className={labelClass}>
                            게임명 *
                        </label>
                        <input
                            id="add-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                            placeholder="머더 미스터리 시리즈 01"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="add-minPlayers" className={labelClass}>
                                최소 인원 *
                            </label>
                            <input
                                id="add-minPlayers"
                                type="number"
                                min={1}
                                value={minPlayers}
                                onChange={(e) => setMinPlayers(Number(e.target.value) || 1)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="add-maxPlayers" className={labelClass}>
                                최대 인원 (비우면 무제한)
                            </label>
                            <input
                                id="add-maxPlayers"
                                type="number"
                                min={1}
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(e.target.value)}
                                className={inputClass}
                                placeholder="6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="add-company" className={labelClass}>
                            제작사
                        </label>
                        <input
                            id="add-company"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={inputClass}
                            placeholder="언더독 게임즈"
                        />
                    </div>
                    <div>
                        <label htmlFor="add-series" className={labelClass}>
                            시리즈
                        </label>
                        <input
                            id="add-series"
                            type="text"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
                            className={inputClass}
                            placeholder="미스터리 파티 시리즈"
                        />
                    </div>
                    <div>
                        <label htmlFor="add-thumbnail" className={labelClass}>
                            썸네일 URL
                        </label>
                        <input
                            id="add-thumbnail"
                            type="url"
                            value={thumbnail}
                            onChange={(e) => setThumbnail(e.target.value)}
                            className={inputClass}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label htmlFor="add-description" className={labelClass}>
                            시놉시스
                        </label>
                        <textarea
                            id="add-description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputClass}
                            placeholder="게임 소개 또는 시놉시스"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={submitting} className="btn-primary px-4 py-2">
                            {submitting ? "추가 중..." : "추가하기"}
                        </button>
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-head-gray-600 hover:underline">
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
