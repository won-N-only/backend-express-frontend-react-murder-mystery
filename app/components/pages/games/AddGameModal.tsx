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
    ownerNote: string[] | null;
}

const inputClass =
    "border border-head-border text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent  h-[40px]";
const labelClass = "block text-base font-semibold text-head-text";

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
    const [ownerNote, setOwnerNote] = useState("");
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
        setOwnerNote("");
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
                ownerNote: ownerNote.trim() !== "" ? ownerNote.trim().split("\n") : null,
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
            className="fixed inset-0 z-50 flex items-center justify-center p-[20px] bg-black/50"
            onClick={handleClose}
        >
            <div
                className="  bg-head-main shadow-soft   w-full max-w-[750px]  max-h-[90vh]  h-auto   overflow-hidden  flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-head-main z-10 px-[30px] py-[20px] flex-shrink-0 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-head-text">게임 추가</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-head-text hover:text-head-text text-2xl leading-none btn-standard-padding"
                    >
                        ×
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto overscroll-contain px-[30px] pb-[20px] space-y-[20px]"
                >
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2  ">{error}</p>}
                    <div className="space-y-[20px]">
                        {/* 게임명 */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[20px]">
                            <label
                                htmlFor="add-name"
                                className={`${labelClass} font-semibold sm:w-[120px]`}
                            >
                                * 게임명
                            </label>
                            <input
                                id="add-name"
                                className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="머더 미스터리 시리즈 01"
                            />
                        </div>
                        {/* 최소/최대 인원 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                            <div className="flex items-center">
                                <label
                                    htmlFor="add-minPlayers"
                                    className={`${labelClass} mr-4 font-semibold w-[120px] shrink-0`}
                                >
                                    * 최소 인원
                                </label>
                                <input
                                    id="add-minPlayers"
                                    type="number"
                                    min={1}
                                    value={minPlayers}
                                    onChange={(e) => setMinPlayers(Number(e.target.value) || 1)}
                                    className={`${inputClass} w-full sm:w-[215px] px-4 text-sm`}
                                />
                            </div>

                            <div className="flex items-center">
                                <label
                                    htmlFor="add-maxPlayers"
                                    className={`${labelClass} mr-4 font-semibold w-[120px] shrink-0`}
                                >
                                    * 최대 인원
                                </label>
                                <input
                                    id="add-maxPlayers"
                                    type="number"
                                    min={1}
                                    value={maxPlayers}
                                    onChange={(e) => setMaxPlayers(e.target.value)}
                                    className={`${inputClass} w-full sm:w-[215px] px-4 text-sm`}
                                    placeholder="6"
                                />
                            </div>
                        </div>
                        {/* 제작사 */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-[20px]">
                            <label
                                htmlFor="add-company"
                                className={`${labelClass} font-semibold sm:w-[120px]`}
                            >
                                * 제작사
                            </label>
                            <input
                                id="add-company"
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                                placeholder="언더독 게임즈"
                            />
                        </div>
                        {/* 시리즈 */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-[20px]">
                            <label
                                htmlFor="add-series"
                                className={`${labelClass} font-semibold sm:w-[120px]`}
                            >
                                * 시리즈
                            </label>
                            <input
                                id="add-series"
                                type="text"
                                value={series}
                                onChange={(e) => setSeries(e.target.value)}
                                className={`${inputClass} w-full sm:w-[570px] px-4 text-sm`}
                                placeholder="미스터리 파티 시리즈"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="add-description" className={labelClass}>
                            * 시놉시스
                        </label>
                        <textarea
                            id="add-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`h-[200px] w-full  mt-2 border border-head-border text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent`}
                            placeholder="게임 소개 또는 시놉시스"
                        />
                    </div>
                    <div>
                        <label htmlFor="add-ownerNote" className={labelClass}>
                            소유자
                        </label>
                        <textarea
                            id="add-ownerNote"
                            value={ownerNote}
                            onChange={(e) => setOwnerNote(e.target.value)}
                            className={`h-[100px] w-full  mt-2 border border-head-border text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent`}
                            placeholder="소유자, 엔터로 구분"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-3">
                        <button type="submit" disabled={submitting} className="btn-primary">
                            {submitting ? "추가 중..." : "추가하기"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-standard-padding text-head-white  bg-gray-500 hover:underline"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
