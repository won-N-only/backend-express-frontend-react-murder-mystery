export class CommentNotFoundError extends Error {
    constructor(public readonly commentId: string) {
        super(`Comment not found: ${commentId}`);
        this.name = "CommentNotFoundError";
        Object.setPrototypeOf(this, CommentNotFoundError.prototype);
    }
}
