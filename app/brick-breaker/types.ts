export type Hair = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    alive: boolean;
};

export type GameState = {
    ballX: number;
    ballY: number;
    ballDx: number;
    ballDy: number;
    paddleX: number;
    hairs: Hair[];
    animId: number | null;
    stopped: boolean;
    finalPaddleX: number | null;
    aliveCount: number;
};
