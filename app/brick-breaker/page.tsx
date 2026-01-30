"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    FALLING_HAIR_SPEED,
    HEAD_SIZE,
    PADDLE_HIT_WIDTH,
} from "./constants";
import {
    checkPaddleCollision,
    createInitialGameState,
    initHairs,
    updateBallPosition,
    updateHairsAndCheckCollisions,
} from "./gameLogic";
import { clearCanvas, drawBall, drawFallingHair, drawHairs, drawPaddle } from "./gameRenderer";
import type { GameState } from "./types";
import { useControl } from "./useControl";
import { useImages } from "./useImages";

export default function BrickBreakerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const gameRef = useRef<GameState | null>(null);
    const fallingHairYRef = useRef<number | null>(null);
    const fallingAnimIdRef = useRef<number | null>(null);

    const { paddleImgRef, sadHeadImgRef, hairImgRef } = useImages();

    // Canvas context 초기화
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && !ctxRef.current) {
            ctxRef.current = canvas.getContext("2d");
        }
    }, []);

    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const hairs = initHairs(cw, ch);
        gameRef.current = createInitialGameState(cw, ch, hairs);

        setScore(0);
        setGameOver(false);
        setWon(false);
        fallingHairYRef.current = null;
        setStarted(true);
    }, []);

    useControl(canvasRef, gameRef, started, gameOver, won);

    useEffect(() => {
        if (!started || gameOver || won) return;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const game = gameRef.current;
        if (!game) return;

        const tick = () => {
            const g = gameRef.current;
            if (!g || g.stopped) return;

            const { ballLeft, ballRight, ballTop, ballBottom } = updateBallPosition(g, cw, ch);

            checkPaddleCollision(g, ballLeft, ballRight, ballTop, ballBottom, ch);

            if (ballBottom >= ch) {
                g.stopped = true;
                g.finalPaddleX = g.paddleX;
                setGameOver(true);
                return;
            }

            const scoreIncrease = updateHairsAndCheckCollisions(
                g,
                ballLeft,
                ballRight,
                ballTop,
                ballBottom,
            );

            if (scoreIncrease > 0) {
                setScore((s) => s + scoreIncrease);
            }

            const justWon = g.aliveCount === 0;
            if (justWon) {
                g.stopped = true;
                setWon(true);
            }

            clearCanvas(ctx, cw, ch);
            drawHairs(ctx, g.hairs, hairImgRef.current);
            drawBall(ctx, g.ballX, g.ballY);

            const paddleX = g.finalPaddleX !== null ? g.finalPaddleX : g.paddleX;
            drawPaddle(ctx, paddleX, ch, paddleImgRef.current);

            if (justWon && hairImgRef.current) {
                const hairStopY = ch - HEAD_SIZE;
                drawFallingHair(ctx, paddleX, ch, hairStopY, 0, hairImgRef.current);
            }

            g.animId = requestAnimationFrame(tick);
        };
        game.animId = requestAnimationFrame(tick);

        return () => {
            if (gameRef.current?.animId != null) cancelAnimationFrame(gameRef.current.animId);
        };
    }, [started, gameOver, won]);

    useEffect(() => {
        if (!started || (!gameOver && !won)) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const g = gameRef.current;
        if (!g) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const paddleX = g.finalPaddleX !== null ? g.finalPaddleX : g.paddleX;
        const headX = paddleX + (PADDLE_HIT_WIDTH - HEAD_SIZE) / 2;
        const headY = ch - HEAD_SIZE;
        const hairStopY = headY;

        const drawFinalFrame = (fallingY: number | null, rotationAngle: number = 0) => {
            clearCanvas(ctx, cw, ch);
            drawHairs(ctx, g.hairs, hairImgRef.current);

            const headImg =
                gameOver && sadHeadImgRef.current ? sadHeadImgRef.current : paddleImgRef.current;
            if (headImg) {
                ctx.drawImage(headImg, headX, headY, HEAD_SIZE, HEAD_SIZE);
            }
            if (won && hairImgRef.current) {
                const drawY = fallingY !== null ? fallingY : hairStopY;
                drawFallingHair(ctx, paddleX, ch, drawY, rotationAngle, hairImgRef.current);
            }
        };

        if (won) {
            if (fallingHairYRef.current === null) {
                fallingHairYRef.current = -HEAD_SIZE;
            }

            const tick = () => {
                const currentY = fallingHairYRef.current;
                if (currentY === null) return;

                if (currentY >= hairStopY) {
                    fallingHairYRef.current = hairStopY;
                    fallingAnimIdRef.current = null;
                    drawFinalFrame(hairStopY, 0);
                    return;
                }

                fallingHairYRef.current = Math.min(currentY + FALLING_HAIR_SPEED, hairStopY);
                drawFinalFrame(fallingHairYRef.current, 0);
                fallingAnimIdRef.current = requestAnimationFrame(tick);
            };
            fallingAnimIdRef.current = requestAnimationFrame(tick);

            return () => {
                if (fallingAnimIdRef.current != null) {
                    cancelAnimationFrame(fallingAnimIdRef.current);
                    fallingAnimIdRef.current = null;
                }
            };
        }

        drawFinalFrame(null);
    }, [gameOver, won, started]);

    return (
        <div className="flex flex-col items-center px-4 py-8">
            <div className="mb-4 flex items-center justify-between gap-4">
                <Link href="/" className="text-head-text underline hover:text-head-brown">
                    ← 메인으로
                </Link>
                <span className="font-bold text-head-text">점수: {score}</span>
            </div>

            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="max-w-full border-2 border-head-border bg-head-main touch-none"
                style={{
                    width: "min(800px, 100vw - 2rem)",
                    height: "auto",
                    aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
                }}
            />

            {!started && (
                <button
                    type="button"
                    onClick={startGame}
                    className="mt-4 rounded-xl bg-head-brown px-6 py-3 font-bold text-white hover:opacity-90"
                >
                    시작
                </button>
            )}
            {gameOver && (
                <div className="mt-4 text-center">
                    <p className="text-xl font-bold text-head-text">게임 오버</p>
                    <button
                        type="button"
                        onClick={startGame}
                        className="mt-2 rounded-xl bg-head-brown px-6 py-3 font-bold text-white hover:opacity-90"
                    >
                        다시 하기
                    </button>
                </div>
            )}
            {won && (
                <div className="mt-4 text-center">
                    <p className="text-xl font-bold text-head-text">클리어!</p>
                    <button
                        type="button"
                        onClick={startGame}
                        className="mt-2 rounded-xl bg-head-brown px-6 py-3 font-bold text-white hover:opacity-90"
                    >
                        다시 하기
                    </button>
                </div>
            )}
            <div className="mt-4 w-full max-w-[800px] text-left text-head-text bg-head-white rounded-lg p-4">
                <h3 className="mb-2 font-bold">게임 설명</h3>
                <ul className="space-y-1 text-sm">
                    <li>• 마우스 또는 손가락을 움직여 대머리로 공을 튕겨주세요</li>
                    <li>• 공이 머리카락에 닿으면 머리카락이 사라지고 점수가 올라갑니다</li>
                    <li>• 모든 머리카락을 가지면 가발을 얻어요!!</li>
                    <li>• 공이 바닥에 떨어지면 앞으로 평생을 대머리로 살아야합니다 ㅠㅠ</li>
                </ul>
            </div>
        </div>
    );
}
