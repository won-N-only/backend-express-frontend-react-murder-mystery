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
        <div className="min-h-screen bg-head-main flex flex-col items-center p-2 lg:p-8">
            <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12">
                {/* 1. Game Area */}
                <div className="relative w-full lg:w-auto flex-shrink-0 flex justify-center">
                    <div className="rounded-none border-4 border-head-brown shadow-2xl bg-head-gray-100 overflow-hidden w-full max-w-[800px]">
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            className="block cursor-none touch-none w-full h-auto bg-head-gray-100"
                            style={{
                                maxHeight: "75vh",
                                objectFit: "contain",
                            }}
                        />

                        {/* Start Overlay */}
                        {!started && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                                <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
                                    벽돌 깨기
                                </h2>
                                <p className="mb-8 text-lg opacity-90">
                                    머리카락을 모두 모아 가발을 완성하세요!
                                </p>
                                <button
                                    onClick={startGame}
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                                >
                                    START
                                </button>
                            </div>
                        )}

                        {/* Game Over Overlay */}
                        {gameOver && (
                            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                                <h2 className="text-5xl font-black mb-2 text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                    GAME OVER
                                </h2>
                                <p className="text-xl mb-6 font-medium">
                                    영원히 대머리로 남게 되었습니다...
                                </p>

                                <button
                                    onClick={startGame}
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                                >
                                    RETRY
                                </button>
                            </div>
                        )}

                        {/* Win Overlay */}
                        {won && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-head-text text-center p-6  ">
                                <h2 className="text-4xl lg:text-5xl font-black mb-6 text-yellow-400 drop-shadow-md">
                                    CLEAR!
                                </h2>
                                <p className="text-lg lg:text-xl mb-8 font-medium">축하합니다!</p>
                                <button
                                    onClick={startGame}
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                                >
                                    다시하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Sidebar / Info (Right Side) */}
                <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
                    {/* Game Info Card */}
                    <div className="bg-head-white border-4 border-head-brown p-6 shadow-lg rounded-none">
                        <div className="flex justify-between items-start border-b-4 border-head-brown pb-2 mb-4">
                            <h1 className="text-3xl font-black text-head-text">벽돌 깨기</h1>
                            <Link
                                href="/"
                                className="text-sm font-bold text-head-brown underline hover:no-underline mt-2"
                            >
                                ← 메인으로
                            </Link>
                        </div>

                        <div className="bg-head-gray-100 p-4 border border-head-border mb-4">
                            <h3 className="font-bold text-head-brown mb-2 text-lg">💡 게임 설명</h3>
                            <ul className="text-sm text-head-text space-y-2 list-disc pl-4">
                                <li>마우스/터치로 대머리를 움직여 공을 튕기세요.</li>
                                <li>공이 머리카락에 닿으면 점수 획득!</li>
                                <li>모든 머리카락을 가지면 가발을 얻어요!</li>
                                <li>
                                    공이 바닥에 떨어지면 앞으로 평생을 대머리로 살아야합니다 ㅠㅠ
                                </li>
                            </ul>{" "}
                        </div>
                    </div>

                    {/* Score Card */}
                    <div className="bg-head-text text-white border-4 border-head-white p-6 shadow-lg rounded-none">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🏆 기록 보관실
                        </h3>
                        <div className="flex justify-between items-end">
                            <span className="text-gray-300 text-sm">Score</span>
                            <span className="text-4xl font-black text-yellow-400">{score}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
