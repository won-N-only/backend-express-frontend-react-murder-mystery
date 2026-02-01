"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, STAGES } from "./constants";
import { useControl } from "./hooks/useControl";
import { useFallingHairAnimation } from "./hooks/useFallingHairAnimation";
import { useImages } from "./hooks/useImages";
import type { GameState } from "./types";
import {
    checkPaddleCollision,
    createInitialGameState,
    initHairs,
    updateBallPosition,
    updateHairsAndCheckCollisions,
} from "./utils/gameLogic";
import { clearCanvas, drawBall, drawHairs, drawPaddle } from "./utils/gameRenderer";

export default function BrickBreakerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const gameRef = useRef<GameState | null>(null);

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
    const [stage, setStage] = useState(0);
    const [stageClear, setStageClear] = useState(false);

    const initializeStage = useCallback((stageIdx: number) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        if (stageIdx >= STAGES.length) {
            setWon(true); // All stages cleared
            return;
        }

        const stageConfig = STAGES[stageIdx];
        const cw = canvas.width;
        const ch = canvas.height;
        const hairs = initHairs(cw, ch, stageConfig); // Pass stageConfig
        gameRef.current = createInitialGameState(cw, ch, hairs, stageConfig); // Pass stageConfig

        // Ensure previous animation frame is cancelled if exists
        if (gameRef.current?.animId != null) {
            cancelAnimationFrame(gameRef.current.animId);
        }
        gameRef.current.stopped = false; // Ensure game is not stopped

        setScore(0);
        setGameOver(false);
        setWon(false);
        setStage(stageIdx); // Set current stage
        setStageClear(false); // Clear stage clear overlay
        setStarted(true); // Start the game loop
    }, []);

    const startNextStage = useCallback(() => {
        initializeStage(stage + 1);
    }, [initializeStage, stage]);

    useControl(canvasRef, gameRef, started && !stageClear, gameOver, won);

    const { startFallingHairAnimation } = useFallingHairAnimation({
        canvasRef,
        ctxRef,
        paddleX: gameRef.current?.finalPaddleX ?? gameRef.current?.paddleX ?? 0,
        canvasHeight: CANVAS_HEIGHT,
        canvasWidth: CANVAS_WIDTH,
        sadHeadImg: sadHeadImgRef.current,
        paddleImg: paddleImgRef.current,
        hairImg: hairImgRef.current,
        gameOver,
        won,
        hairs: gameRef.current?.hairs || [],
    });

    useEffect(() => {
        if (!started || gameOver || won || stageClear) return;
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
                if (stage < STAGES.length - 1) {
                    // If there are more stages
                    setStageClear(true);
                } else {
                    // All stages cleared
                    setWon(true);
                }
                return;
            }

            clearCanvas(ctx, cw, ch);
            drawHairs(ctx, g.hairs, hairImgRef.current);
            drawBall(ctx, g.ballX, g.ballY);

            const paddleX = g.finalPaddleX !== null ? g.finalPaddleX : g.paddleX;
            drawPaddle(ctx, paddleX, ch, paddleImgRef.current);

            g.animId = requestAnimationFrame(tick);
        };
        game.animId = requestAnimationFrame(tick);

        return () => {
            if (gameRef.current?.animId != null) cancelAnimationFrame(gameRef.current.animId);
        };
    }, [
        started,
        gameOver,
        won,
        stageClear,
        stage,
        initializeStage,
        startFallingHairAnimation,
        paddleImgRef,
        sadHeadImgRef,
        hairImgRef,
    ]);

    return (
        <div className="min-h-screen bg-head-main flex flex-col items-center p-2 lg:p-8">
            <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-4 lg:gap-6">
                {/* 1. Game Area */}
                <div className="relative w-full lg:w-auto flex-shrink-0 flex justify-center">
                    <div className="rounded-none   shadow-2xl bg-head-gray-100 overflow-hidden w-full max-w-[800px]">
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
                                    가발 깨기
                                </h2>
                                <p className="mb-8 text-lg opacity-90">
                                    머리카락을 모두 모아 가발을 완성하세요!
                                </p>
                                <button
                                    onClick={() => initializeStage(0)}
                                    className="bg-head-brown text-white text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg btn-standard-padding"
                                >
                                    START
                                </button>
                            </div>
                        )}

                        {/* Stage Clear Overlay */}
                        {stageClear && (
                            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                                <h2 className="text-5xl font-black mb-2 text-green-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                    STAGE {stage + 1} CLEAR!
                                </h2>
                                <p className="text-xl mb-6 font-medium">다음 단계로 나아가세요!</p>

                                <button
                                    onClick={startNextStage}
                                    className="bg-head-brown text-white text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg btn-standard-padding"
                                >
                                    NEXT STAGE
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
                                    onClick={() => initializeStage(stage)}
                                    className="bg-head-brown text-white text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg btn-standard-padding"
                                >
                                    RETRY
                                </button>
                            </div>
                        )}

                        {/* Win Overlay (Final Win) */}
                        {won && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-head-text text-center p-6  ">
                                <h2 className="text-4xl lg:text-5xl font-black mb-6 text-yellow-400 drop-shadow-md">
                                    ALL STAGES CLEAR!
                                </h2>
                                <p className="text-lg lg:text-xl mb-8 font-medium">축하합니다!</p>
                                <button
                                    onClick={() => initializeStage(0)}
                                    className="bg-head-brown text-white text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg btn-standard-padding"
                                >
                                    다시하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Sidebar / Info (Right Side) */}
                <div className="w-full lg:w-[350px] shrink-0  ">
                    {/* Game Info Card */}
                    <div className="bg-head-white shadow-xl border border-head-border flex flex-col h-full w-full">
                        <div className="flex justify-between items-start p-6">
                            <h1 className="text-3xl font-black text-head-text">가발 깨기</h1>
                            <Link
                                href="/"
                                className="text-sm font-bold text-head-brown underline hover:no-underline mt-2"
                            >
                                ← 메인으로
                            </Link>
                        </div>

                        <div className="bg-head-gray-100 p-4 mx-4 mb-4   ">
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

                        {/* Score Card */}
                        <div className="bg-head-text text-white p-6  mt-auto">
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
        </div>
    );
}
