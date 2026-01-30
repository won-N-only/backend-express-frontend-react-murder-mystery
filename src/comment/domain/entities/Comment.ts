import type { ObjectId } from "mongodb";

/**
 * 게임 댓글/대댓글 엔티티.
 * parentId가 null이면 최상위 댓글, 있으면 해당 댓글에 대한 답글(reply).
 */
export class Comment {
    constructor(
        public readonly id: ObjectId | undefined,
        public readonly gameId: ObjectId,
        public readonly authorId: ObjectId,
        public readonly authorName: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly parentId: ObjectId | null,
    ) { }

    isReply(): boolean {
        return this.parentId != null;
    }
}
