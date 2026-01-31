import { BALL_R, HAIR_SIZE, HEAD_SIZE, PADDLE_HIT_WIDTH } from "../constants";
import type { GameState } from "../types";

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = "#f1f0ec";
    ctx.fillRect(0, 0, width, height);
}

export function drawHairs(
    ctx: CanvasRenderingContext2D,
    hairs: GameState["hairs"],
    hairImg: HTMLImageElement | null
) {
    if (hairImg) {
        for (let i = 0; i < hairs.length; i++) {
            const h = hairs[i];
            if (h.alive) {
                ctx.drawImage(hairImg, h.x, h.y, HAIR_SIZE, HAIR_SIZE);
            }
        }
    } else {
        ctx.fillStyle = "#573f33";
        for (let i = 0; i < hairs.length; i++) {
            const h = hairs[i];
            if (h.alive) {
                ctx.fillRect(h.x, h.y, HAIR_SIZE, HAIR_SIZE);
            }
        }
    }
}

export function drawBall(ctx: CanvasRenderingContext2D, ballX: number, ballY: number) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#573f33";
    ctx.fill();
}

export function drawPaddle(
    ctx: CanvasRenderingContext2D,
    paddleX: number,
    canvasHeight: number,
    paddleImg: HTMLImageElement | null
) {
    const headX = paddleX + (PADDLE_HIT_WIDTH - HEAD_SIZE) / 2;
    const headY = canvasHeight - HEAD_SIZE;
    if (paddleImg) {
        ctx.drawImage(paddleImg, headX, headY, HEAD_SIZE, HEAD_SIZE);
    } else {
        ctx.fillStyle = "#573f33";
        ctx.fillRect(headX, headY, HEAD_SIZE, HEAD_SIZE);
    }
}

export function drawFallingHair(
    ctx: CanvasRenderingContext2D,
    paddleX: number,
    canvasHeight: number,
    fallingY: number,
    rotationAngle: number,
    hairImg: HTMLImageElement | null
) {
    if (!hairImg) return;
    const headX = paddleX + (PADDLE_HIT_WIDTH - HEAD_SIZE) / 2;

    // 회전 없이 그리기
    ctx.drawImage(hairImg, headX, fallingY, HEAD_SIZE, HEAD_SIZE);
}
