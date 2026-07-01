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

function decodeHtmlEntities(text: string): string {
    // 서버에서 sanitize-html 처리 후 `&gt;`, `&amp;` 같은 엔티티가 그대로 저장되는 경우를 대비
    return text
        // Named entities (decode & first so that `&amp;gt;` becomes `&gt;`)
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        // Numeric entities
        .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
            String.fromCodePoint(parseInt(hex, 16)),
        );
}

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
    const [isScrolled, setIsScrolled] = useState(false);
    const SCROLL_THRESHOLD = 24; // 스크롤 감지 임계값

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

    const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > SCROLL_THRESHOLD);
    };

    // 모달이 열릴 때 스크롤 잠금 및 해제
    useEffect(() => {
        if (gameId) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden"; // html 스크롤도 방지
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }
        // 컴포넌트 언마운트 시 스크롤 복원
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [gameId]);

    // gameId 변경 시 데이터 뮤테이트 및 스크롤 상태 초기화
    useEffect(() => {
        if (gameId) {
            mutateGame();
            setIsScrolled(false);
            // 모달 콘텐츠 스크롤을 최상단으로 초기화 (필요하다면 ref를 사용하여 특정 div에 적용)
            const modalContent = document.querySelector(".game-modal-content");
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }
    }, [gameId, mutateGame]);

    if (!gameId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-head-white rounded-lg shadow-lg max-w-content w-full max-h-[90vh] flex flex-col" // overflow-hidden 제거
                onClick={(e) => e.stopPropagation()}
            >
                {isLoadingGame ? (
                    <div className="flex items-center justify-center p-8">
                        <span className="text-head-text">로딩 중...</span>
                    </div>
                ) : game ? (
                    <>
                        {/* 헤더 */}
                        <div
                            className="bg-head-main sticky top-0 z-10 flex-shrink-0 transition-all duration-300"
                            style={{ padding: isScrolled ? "12px 24px" : "28px 24px" }} // p-7 대신 padding 직접 지정
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-1 items-center gap-4 min-w-0">
                                    {/* 썸네일 */}
                                    <div
                                        className={`shrink-0 relative bg-white rounded-full border-4 border-head-white overflow-hidden transition-all duration-300 ${
                                            isScrolled
                                                ? "w-0 h-0 opacity-0"
                                                : "w-16 h-16 md:w-20 md:h-20"
                                        }`}
                                    >
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
                                        <h2
                                            className={`font-bold text-head-text mb-1 leading-tight transition-all duration-300 ${
                                                isScrolled
                                                    ? "text-xl truncate"
                                                    : "text-xl md:text-2xl truncate"
                                            }`}
                                            title={game.name} // 말줄임 시 전체 제목 표시
                                        >
                                            {game.name}
                                        </h2>
                                                                                <div
                                                                                    className={`transition-all duration-300 space-y-2 ${ // Added space-y-2
                                                                                        isScrolled ? "h-0 opacity-0 invisible" : ""
                                                                                    }`}
                                                                                >
                                                                                    <div className="text-sm font-bold text-head-text opacity-70">
                                                                                        #{game.orderNumber}
                                                                                    </div>
                                                                                    {game.category === "오프라인" && game.owners && game.owners.length > 0 && (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-sm font-extrabold text-head-text">
                                                                                                소장자{" "}
                                                                                            </span>
                                                                                            <span className="text-sm font-thin text-head-text">
                                                                                                {game.owners.join(" ｜ ")}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="text-sm font-semibold text-head-text opacity-90">
                                                                                        <span>
                                                                                            {game.minPlayers}
                                                                                            {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
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
                                    </div>
                                </div>
                                {/* 액션 버튼 */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <Link
                                        href={`/games/${gameId}/edit`}
                                        className={`text-md bg-head-brown text-white rounded-none font-bold btn-standard-padding hidden md:block transition-all duration-300 ${
                                            isScrolled ? "opacity-0 pointer-events-none" : ""
                                        }`}
                                    >
                                        게임 수정
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="p-2 text-2xl opacity-60 hover:opacity-100 text-head-text transition-opacity duration-300"
                                        aria-label="닫기"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div
                            className="flex-1 overflow-y-auto bg-head-main px-6 pb-6 space-y-6 game-modal-content"
                            onScroll={handleContentScroll}
                        >
                            {/* 시놉시스 */}
                            <section className="rounded-none  bg-head-white p-5">
                                <h2 className="text-xl font-bold text-head-text">시놉시스</h2>
                                <hr className="border-head-gray-500 opacity-40 my-5" />
                                {game.description && (
                                    <p className="whitespace-pre-wrap leading-relaxed text-head-text">
                                        {decodeHtmlEntities(game.description)}
                                    </p>
                                )}
                            </section>
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
                                                    className="text-md bg-head-brown text-white rounded-none font-bold btn-standard-padding"
                                                >
                                                    {isEditing ? "완료" : "수정"}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {players.map((p) => {
                                                    const status =
                                                        completionMap.get(p._id) ??
                                                        CompletionStatus.NOT_DONE;
                                                    return (
                                                        <div
                                                            key={p._id}
                                                            className="flex flex-col gap-2 mb-4"
                                                        >
                                                            <span className="text-md font-extrabold text-center text-head-text">
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
