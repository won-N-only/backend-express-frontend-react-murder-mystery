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
        <div className="border border-head-border bg-head-gray-50 p-4 mb-2">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-md text-head-text font-semibold">{comment.content}</p>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-head-text">
                            {comment.authorName}
                        </span>
                        <span className="text-xs font-medium text-head-text">
                            {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onDelete(comment._id).then(onMutate)}
                    className="text-xs text-head-gray-400 hover:text-red-600 shrink-0 font-medium"
                >
                    삭제
                </button>
            </div>

            {replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-head-border space-y-3">
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

    return (
        <section className="rounded-none bg-head-white p-6 space-y-6">
            <h2 className="text-xl font-bold text-head-text">댓글 {comments.length}개</h2>

            {/* 경고 메시지 */}
            <span className="text-sm text-head-text font-medium">
                누군가의 소중한 머미일 수 있습니다.{" "}
                <span className="text-red-600 font-bold">스포 절대 금지금지</span>
            </span>

            <form onSubmit={handleSubmit} className="space-y-4 ">
                <div>
                    <label className="block text-sm font-bold text-head-text mb-1">* 작성자</label>
                    <AuthorSuggestInput
                        className="mt-1"
                        players={players}
                        value={authorDisplay}
                        selectedId={authorId}
                        onChange={(id, name) => {
                            setAuthorId(id);
                            setAuthorDisplay(name);
                        }}
                        placeholder="이름 입력 후 아래에서 선택"
                        inputClassName="rounded-none "
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-head-text mb-1">* 내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        rows={3}
                        className="w-full border border-head-brown rounded-none px-3 py-2 text-sm focus:outline-none bg-white"
                        required
                    />
                </div>
                <div className="flex justify-start">
                    <button
                        type="submit"
                        disabled={submitting || authorId == null}
                        className=" bg-head-brown text-white  btn-standard-padding rounded-none text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {submitting ? "등록 중..." : "댓글 작성"}
                    </button>
                </div>
            </form>

            <div className="">
                {tree.length === 0 ? (
                    <p className="text-sm text-head-text opacity-40 text-left py-0.5">
                        아직 댓글이 없습니다.
                    </p>
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
