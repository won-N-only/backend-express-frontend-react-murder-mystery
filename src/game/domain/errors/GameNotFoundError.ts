export class GameNotFoundError extends Error {
    constructor(public readonly gameId: string) {
        super(`Game not found: ${gameId}`);
        this.name = "GameNotFoundError";
        Object.setPrototypeOf(this, GameNotFoundError.prototype);
    }
}
