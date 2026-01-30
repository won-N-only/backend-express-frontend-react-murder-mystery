"use client";

import AuthorSuggestInput from "@app/components/common/AuthorSuggestInput";
import { fetcher } from "@app/lib/fetcher";
import type { Comment as CommentType, Player } from "@app/types";
import { useMemo, useState } from "react";
import useSWR from "swr";

interface GameCommentsSectionProps {
    gameId: string;
}

function buildCommentTree(comments: CommentType[]) {
    const byId = new Map(comments.map((c) => [c._id, { ...c, replies: [] as CommentType[] }]));
    const roots: (CommentType & { replies: CommentType[] })[] = [];
    for (const c of comments) {
        const node = byId.get(c._id)!;
        if (!c.parentId) {
            roots.push(node);
        } else {
            const parent = byId.get(c.parentId);
            if (parent && "replies" in parent) parent.replies.push(c);
            else roots.push(node);
        }
    }
    roots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    for (const r of roots) {
        (r as any).replies.sort(
            (a: CommentType, b: CommentType) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
    }
    return roots;
}

function CommentItem({
    comment,
    replies,
    players,
    gameId,
    onReply,
    onDelete,
    onMutate,
}: {
    comment: CommentType;
    replies: CommentType[];
    players: Player[];
    gameId: string;
    onReply: (parentId: string) => void;
    onDelete: (id: string) => Promise<void>;
    onMutate: () => void;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyAuthorId, setReplyAuthorId] = useState<string | null>(null);
    const [replyAuthorDisplay, setReplyAuthorDisplay] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || replyAuthorId == null) return;
        setSubmitting(true);
        try {
            const author = players.find((p) => p._id === replyAuthorId);
            const res = await fetch(`/api/games/${gameId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    authorId: replyAuthorId,
                    authorName: author?.name ?? "",
                    content: replyContent.trim(),
                    parentId: comment._id,
                }),
            });
            if (!res.ok) return;
            setReplyContent("");
            setShowReplyForm(false);
            onMutate();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="border-l-2 border-head-border pl-3 py-2">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-head-brown">
                        {comment.authorName}
                    </span>
                    <span className="text-xs text-head-text ml-2">
                        {new Date(comment.createdAt).toLocaleString("ko-KR")}
                    </span>
                    <p className="text-sm text-head-text mt-1 whitespace-pre-wrap">
                        {comment.content}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onDelete(comment._id).then(onMutate)}
                    className="text-xs text-head-text hover:text-red-600 shrink-0"
                >
                    삭제
                </button>
            </div>
            {!showReplyForm ? (
                <button
                    type="button"
                    onClick={() => setShowReplyForm(true)}
                    className="text-xs text-head-brown hover:underline mt-1"
                >
                    답글
                </button>
            ) : (
                <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
                    <AuthorSuggestInput
                        players={players}
                        value={replyAuthorDisplay}
                        selectedId={replyAuthorId}
                        onChange={(id, name) => {
                            setReplyAuthorId(id);
                            setReplyAuthorDisplay(name);
                        }}
                        placeholder="이름 입력 후 아래에서 선택"
                        className="text-sm"
                        inputClassName="py-1"
                    />
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글 내용"
                        rows={2}
                        className="w-full text-sm border border-head-border rounded px-2 py-1"
                        required
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting || replyAuthorId == null}
                            className="btn-primary text-sm px-2 py-1"
                        >
                            {submitting ? "등록 중..." : "등록"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="text-sm text-head-text hover:underline"
                        >
                            취소
                        </button>
                    </div>
                </form>
            )}
            {replies.length > 0 && (
                <div className="mt-3 ml-2 space-y-2">
                    {replies.map((r) => (
                        <CommentItem
                            key={r._id}
                            comment={r}
                            replies={(r as CommentType & { replies: CommentType[] }).replies ?? []}
                            players={players}
                            gameId={gameId}
                            onReply={onReply}
                            onDelete={onDelete}
                            onMutate={onMutate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function GameCommentsSection({ gameId }: GameCommentsSectionProps) {
    const { data: commentsData, mutate } = useSWR<{ comments: CommentType[] }>(
        `/api/games/${gameId}/comments`,
        fetcher,
    );
    const { data: playersData } = useSWR<{ players: Player[] }>("/api/players", fetcher);
    const comments = useMemo(() => commentsData?.comments ?? [], [commentsData?.comments]);
    const players = useMemo(() => playersData?.players ?? [], [playersData?.players]);

    const tree = useMemo(() => buildCommentTree(comments), [comments]);

    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState<string | null>(null);
    const [authorDisplay, setAuthorDisplay] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleDelete = async (commentId: string) => {
        const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("삭제 실패");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || authorId == null) return;
        setSubmitting(true);
        try {
            const author = players.find((p) => p._id === authorId);
            const res = await fetch(`/api/games/${gameId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    authorId,
                    authorName: author?.name ?? "",
                    content: content.trim(),
                }),
            });
            if (!res.ok) return;
            setContent("");
            mutate();
        } finally {
            setSubmitting(false);
        }
    };

    const canComment = players.length > 0;

    return (
        <section className="section-card space-y-4">
            <h2 className="text-xl font-semibold text-head-text">댓글 {comments.length}개</h2>

            {!canComment && (
                <p className="text-sm text-head-text">
                    댓글을 쓰려면 먼저 플레이어(대머리)를 등록해주세요.
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-head-text">작성자</label>
                    <AuthorSuggestInput
                        className="mt-1"
                        players={players}
                        value={authorDisplay}
                        selectedId={authorId}
                        onChange={(id, name) => {
                            setAuthorId(id);
                            setAuthorDisplay(name);
                        }}
                        disabled={!canComment}
                        placeholder="이름 입력 후 아래에서 선택"
                    />
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows={3}
                    className="w-full border border-head-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-head-brown"
                    required
                />
                <button
                    type="submit"
                    disabled={submitting || !canComment || authorId == null}
                    className="btn-primary px-4 py-2"
                >
                    {submitting ? "등록 중..." : "댓글 작성"}
                </button>
            </form>

            <div className="space-y-3">
                {tree.length === 0 ? (
                    <p className="text-sm text-head-text">아직 댓글이 없습니다.</p>
                ) : (
                    tree.map((node) => (
                        <CommentItem
                            key={node._id}
                            comment={node}
                            replies={(node as any).replies ?? []}
                            players={players}
                            gameId={gameId}
                            onReply={() => {}}
                            onDelete={handleDelete}
                            onMutate={mutate}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
