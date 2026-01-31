export interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    speed?: number;
    image?: HTMLImageElement;
}

export type GameState = "start" | "playing" | "gameover" | "clear";
