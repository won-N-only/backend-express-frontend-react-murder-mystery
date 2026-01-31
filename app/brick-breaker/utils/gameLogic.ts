import {
    HAIR_COUNT,
    HAIR_SIZE,
    HAIR_SPEED_MIN,
    HAIR_SPEED_MAX,
    HEAD_SIZE,
    BALL_R,
    PADDLE_HIT_WIDTH,
} from "../constants";
import type { Hair, GameState } from "../types";

export function initHairs(canvasWidth: number, canvasHeight: number): Hair[] {
    const hairs: Hair[] = [];
    const boxTop = 40;
    const boxBottom = canvasHeight - HEAD_SIZE - 80;
    const boxLeft = 0;
    const boxRight = canvasWidth - HAIR_SIZE;

    for (let i = 0; i < HAIR_COUNT; i++) {
        const speedX = HAIR_SPEED_MIN + Math.random() * (HAIR_SPEED_MAX - HAIR_SPEED_MIN);
        const speedY = HAIR_SPEED_MIN + Math.random() * (HAIR_SPEED_MAX - HAIR_SPEED_MIN);
        const dirX = Math.random() > 0.5 ? 1 : -1;
        const dirY = Math.random() > 0.5 ? 1 : -1;

        hairs.push({
            x: boxLeft + Math.random() * (boxRight - boxLeft),
            y: boxTop + Math.random() * (boxBottom - boxTop - HAIR_SIZE),
            dx: speedX * dirX,
            dy: speedY * dirY,
            minX: boxLeft,
            maxX: boxRight,
            minY: boxTop,
            maxY: boxBottom - HAIR_SIZE,
            alive: true,
        });
    }
    return hairs;
}

export function createInitialGameState(
    canvasWidth: number,
    canvasHeight: number,
    hairs: Hair[]
): GameState {
    const paddleX0 = (canvasWidth - PADDLE_HIT_WIDTH) / 2;
    const paddleTop = canvasHeight - HEAD_SIZE;

    return {
        ballX: canvasWidth / 2,
        ballY: paddleTop - 80,
        ballDx: 4,
        ballDy: -4,
        paddleX: paddleX0,
        hairs,
        animId: null,
        stopped: false,
        finalPaddleX: null,
        aliveCount: hairs.length,
    };
}

export function updateBallPosition(game: GameState, canvasWidth: number, canvasHeight: number) {
    game.ballX += game.ballDx;
    game.ballY += game.ballDy;

    const ballLeft = game.ballX - BALL_R;
    const ballRight = game.ballX + BALL_R;
    const ballTop = game.ballY - BALL_R;
    const ballBottom = game.ballY + BALL_R;

    if (ballLeft <= 0) {
        game.ballDx = Math.abs(game.ballDx);
        game.ballX = BALL_R;
    } else if (ballRight >= canvasWidth) {
        game.ballDx = -Math.abs(game.ballDx);
        game.ballX = canvasWidth - BALL_R;
    }
    if (ballTop <= 0) {
        game.ballDy = Math.abs(game.ballDy);
        game.ballY = BALL_R;
    }

    return { ballLeft, ballRight, ballTop, ballBottom };
}

export function checkPaddleCollision(
    game: GameState,
    ballLeft: number,
    ballRight: number,
    ballTop: number,
    ballBottom: number,
    canvasHeight: number
): boolean {
    const paddleTop = canvasHeight - HEAD_SIZE;
    if (ballBottom >= paddleTop && ballTop <= canvasHeight) {
        const paddleRight = game.paddleX + PADDLE_HIT_WIDTH;
        if (ballRight >= game.paddleX && ballLeft <= paddleRight) {
            game.ballDy = -Math.abs(game.ballDy);
            game.ballY = paddleTop - BALL_R;
            const hitPos = (game.ballX - game.paddleX) / PADDLE_HIT_WIDTH;
            game.ballDx = (hitPos - 0.5) * 10;
            return true;
        }
    }
    return false;
}

export function updateHairsAndCheckCollisions(
    game: GameState,
    ballLeft: number,
    ballRight: number,
    ballTop: number,
    ballBottom: number
): number {
    let scoreIncrease = 0;

    for (let i = 0; i < game.hairs.length; i++) {
        const h = game.hairs[i];
        if (!h.alive) continue;

        h.x += h.dx;
        h.y += h.dy;
        if (h.x < h.minX) {
            h.dx = Math.abs(h.dx);
            h.x = h.minX;
        } else if (h.x > h.maxX) {
            h.dx = -Math.abs(h.dx);
            h.x = h.maxX;
        }
        if (h.y < h.minY) {
            h.dy = Math.abs(h.dy);
            h.y = h.minY;
        } else if (h.y > h.maxY) {
            h.dy = -Math.abs(h.dy);
            h.y = h.maxY;
        }

        if (
            ballRight >= h.x &&
            ballLeft <= h.x + HAIR_SIZE &&
            ballBottom >= h.y &&
            ballTop <= h.y + HAIR_SIZE
        ) {
            h.alive = false;
            game.aliveCount--;
            scoreIncrease += 10;

            const ballCenterX = game.ballX;
            const ballCenterY = game.ballY;
            const hairCenterX = h.x + HAIR_SIZE / 2;
            const hairCenterY = h.y + HAIR_SIZE / 2;

            const dx = ballCenterX - hairCenterX;
            const dy = ballCenterY - hairCenterY;

            if (Math.abs(dx) > Math.abs(dy)) {
                game.ballDx = dx > 0 ? Math.abs(game.ballDx) : -Math.abs(game.ballDx);
                game.ballX = dx > 0 ? h.x + HAIR_SIZE + BALL_R : h.x - BALL_R;
            } else {
                game.ballDy = dy > 0 ? Math.abs(game.ballDy) : -Math.abs(game.ballDy);
                game.ballY = dy > 0 ? h.y + HAIR_SIZE + BALL_R : h.y - BALL_R;
            }
        }
    }

    return scoreIncrease;
}
