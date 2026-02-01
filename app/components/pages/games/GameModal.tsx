"use client";

import CompletionStatusButtons from "@app/components/common/CompletionStatusButtons";
import GameCommentsSection from "@app/components/pages/games/GameCommentsSection";
import { fetcher } from "@app/lib/fetcher";
import type { CompletionStatusValue, Game, Player } from "@app/types";
import { CompletionStatus } from "@app/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface GameModalProps {
    gameId: string | null;
    onClose: () => void;
}

/**
 * 게임 상세 모달
 */
export default function GameModal({ gameId, onClose }: GameModalProps) {
    const {
        data,
        mutate: mutateGame,
        isLoading: isLoadingGame,
    } = useSWR(gameId ? `/api/games/${gameId}` : null, fetcher);

    const {
        data: completionsData,
        mutate: mutateCompletions,
        isLoading: isLoadingCompletions,
    } = useSWR(gameId ? `/api/games/${gameId}/completions` : null, fetcher);

    const { data: playersData } = useSWR("/api/players", fetcher);

    const game: Game | undefined = data?.game;
    const completions = completionsData?.completions ?? [];
    const players: Player[] = playersData?.players ?? [];

    const [isEditing, setIsEditing] = useState(false);

    const completionMap = new Map<string, CompletionStatusValue>(
        completions.map((c: { playerId: string; status: CompletionStatusValue }) => [
            c.playerId,
            c.status,
        ]),
    );

    const updateStatus = async (playerId: string, status: CompletionStatusValue) => {
        if (!gameId) return;
        try {
            const response = await fetch(`/api/games/${gameId}/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, status }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Failed to update status:", error);
                return;
            }

            mutateCompletions();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    useEffect(() => {
        if (gameId) {
            document.body.style.overflow = "hidden";
            mutateGame();
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [gameId, mutateGame]);

    if (!gameId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-head-white rounded-none  shadow-lg max-w-content w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {isLoadingGame ? (
                    <div className="flex items-center justify-center p-8">
                        <span className="text-head-text">로딩 중...</span>
                    </div>
                ) : game ? (
                    <>
                        {/* 헤더 */}
                        <div className="bg-head-main px-6 py-5  flex-shrink-0">
                            <div className="flex items-start gap-4">
                                {/* 썸네일 */}
                                <div className="shrink-0 w-[80px] h-[106px] relative bg-white rounded-full border border-2 border-gray-800">
                                    {game.thumbnail && (
                                        <Image
                                            src={game.thumbnail}
                                            alt={game.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    )}
                                </div>

                                {/* 정보 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm font-bold text-head-text opacity-70 mb-1">
                                                #{game.orderNumber}
                                            </div>
                                            <h2 className="text-2xl font-bold text-head-text mb-2 leading-tight">
                                                {game.name}
                                            </h2>
                                            <div className="text-sm font-semibold text-head-text opacity-90">
                                                <span>
                                                    {game.minPlayers}
                                                    {game.maxPlayers ? `-${game.maxPlayers}` : "+"}
                                                    인
                                                </span>
                                                {(game.company || game.series) && (
                                                    <>
                                                        <span className="mx-2">·</span>
                                                        {game.company && (
                                                            <span>{game.company}</span>
                                                        )}
                                                        {game.company && game.series && (
                                                            <span> : </span>
                                                        )}
                                                        {game.series && <span>{game.series}</span>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {/* 액션 버튼 */}
                                        <div className="flex flex-row-reverse items-start gap-2 p-[30px] py-6">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="text-head-text opacity-50 text-2xl    hover:opacity-70"
                                                aria-label="닫기"
                                            >
                                                ×
                                            </button>
                                            <Link
                                                href={`/games/${gameId}/edit`}
                                                className="text-md bg-head-brown text-white px-4 py-1 rounded-none font-bold"
                                            >
                                                게임 수정
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 overflow-y-auto bg-head-main p-6 space-y-6">
                            {/* 시놉시스 */}
                            <section className="rounded-none  bg-head-white p-6">
                                <h2 className="text-xl font-bold text-head-text mb-4">시놉시스</h2>
                                {game.description && (
                                    <p className="text-head-text whitespace-pre-wrap leading-relaxed">
                                        {game.description}
                                    </p>
                                )}
                            </section>
                            {/* 소유자 */}
                            {game.ownerNote && game.ownerNote.length > 0 && (
                                <section className="rounded-none  bg-head-white p-6">
                                    <h2 className="text-xl font-bold text-head-text mb-4">
                                        소유자
                                    </h2>
                                    {game.ownerNote.map((note, index) => (
                                        <p
                                            key={index}
                                            className="text-head-text whitespace-pre-wrap leading-relaxed"
                                        >
                                            {note}
                                        </p>
                                    ))}
                                </section>
                            )}
                            {/* 댓글 섹션 */}
                            <GameCommentsSection gameId={gameId} />
                            {/* 대머리 완료 여부 토글/컨텐츠 */}
                            <section className="rounded-none  bg-head-white p-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-head-text">
                                        대머리 완료 여부
                                    </h2>
                                </div>

                                <>
                                    {isLoadingCompletions ? (
                                        <div className="text-head-text text-center mt-4">
                                            로딩 중...
                                        </div>
                                    ) : (
                                        <>
                                            <hr className="border-head-gray-500 opacity-40 py-2 my-4" />
                                            <div className="flex justify-end mb-4">
                                                <button
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="text-md bg-head-brown text-white px-4 py-1 rounded-none font-bold"
                                                >
                                                    {isEditing ? "완료" : "수정"}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3">
                                                {players.map((p) => {
                                                    const status =
                                                        completionMap.get(p._id) ??
                                                        CompletionStatus.NOT_DONE;
                                                    return (
                                                        <div
                                                            key={p._id}
                                                            className="flex flex-col gap-2 mb-4"
                                                        >
                                                            <span className="text-sm font-bold text-center text-head-text">
                                                                {p.name}
                                                            </span>
                                                            <hr className="border-head-gray-500 opacity-40 " />
                                                            <div className="flex justify-center">
                                                                <CompletionStatusButtons
                                                                    currentStatus={status}
                                                                    onStatusChange={(s) =>
                                                                        updateStatus(p._id, s)
                                                                    }
                                                                    isEditable={isEditing}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </>
                            </section>{" "}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center p-8">
                        <span className="text-head-text">게임을 찾을 수 없습니다.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
