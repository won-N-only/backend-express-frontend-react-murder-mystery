"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** 패들(대가리) 히트박스 너비 - 마우스로 움직이는 범위 */
const PADDLE_HIT_WIDTH = 100;
/** 대가리 이미지 크기 - 정사각으로 그려서 찌그러짐 방지, 바닥에 붙임 */
const HEAD_SIZE = 56;
const BALL_R = 10;
const HAIR_COUNT = 12;
const HAIR_SIZE = 64;
const HAIR_SPEED_MIN = 1;
const HAIR_SPEED_MAX = 3;
/** 클리어 시 가발이 떨어지는 속도 (px/frame) */
const FALLING_HAIR_SPEED = 2;

type Hair = {
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

export default function BrickBreakerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const paddleImgRef = useRef<HTMLImageElement | null>(null);
    const sadHeadImgRef = useRef<HTMLImageElement | null>(null);
    const hairImgRef = useRef<HTMLImageElement | null>(null);
    const fallingHairYRef = useRef<number | null>(null);
    const fallingAnimIdRef = useRef<number | null>(null);
    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const gameRef = useRef<{
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
    } | null>(null);

    const initHairs = useCallback((canvasWidth: number, canvasHeight: number): Hair[] => {
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
    }, []);

    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const paddleX0 = (cw - PADDLE_HIT_WIDTH) / 2;
        const paddleTop = ch - HEAD_SIZE;
        const hairs = initHairs(cw, ch);

        gameRef.current = {
            ballX: cw / 2,
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
        setScore(0);
        setGameOver(false);
        setWon(false);
        fallingHairYRef.current = null;
        setStarted(true);
    }, [initHairs]);

    useEffect(() => {
        const paddleImg = new Image();
        paddleImg.src = "/favicon_face.png";
        paddleImg.onload = () => {
            paddleImgRef.current = paddleImg;
        };

        const sadHeadImg = new Image();
        sadHeadImg.src = "/sad_head.png";
        sadHeadImg.onload = () => {
            sadHeadImgRef.current = sadHeadImg;
        };

        const hairImg = new Image();
        hairImg.src = "/favicon_hair.png";
        hairImg.onload = () => {
            hairImgRef.current = hairImg;
        };
    }, []);

    useEffect(() => {
        if (!started || gameOver || won) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const paddleTop = ch - HEAD_SIZE;

        const game = gameRef.current;
        if (!game) return;

        const tick = () => {
            const g = gameRef.current;
            if (!g || g.stopped) return;

            g.ballX += g.ballDx;
            g.ballY += g.ballDy;

            const ballLeft = g.ballX - BALL_R;
            const ballRight = g.ballX + BALL_R;
            const ballTop = g.ballY - BALL_R;
            const ballBottom = g.ballY + BALL_R;

            if (ballLeft <= 0) {
                g.ballDx = Math.abs(g.ballDx);
                g.ballX = BALL_R;
            } else if (ballRight >= cw) {
                g.ballDx = -Math.abs(g.ballDx);
                g.ballX = cw - BALL_R;
            }
            if (ballTop <= 0) {
                g.ballDy = Math.abs(g.ballDy);
                g.ballY = BALL_R;
            }

            if (ballBottom >= paddleTop && ballTop <= ch) {
                const paddleRight = g.paddleX + PADDLE_HIT_WIDTH;
                if (ballRight >= g.paddleX && ballLeft <= paddleRight) {
                    g.ballDy = -Math.abs(g.ballDy);
                    g.ballY = paddleTop - BALL_R;
                    const hitPos = (g.ballX - g.paddleX) / PADDLE_HIT_WIDTH;
                    g.ballDx = (hitPos - 0.5) * 10;
                }
            }
            if (ballBottom >= ch) {
                g.stopped = true;
                g.finalPaddleX = g.paddleX;
                setGameOver(true);
                return;
            }

            const hairImg = hairImgRef.current;
            const paddleImg = paddleImgRef.current;
            let scoreIncrease = 0;

            for (let i = 0; i < g.hairs.length; i++) {
                const h = g.hairs[i];
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
                    g.aliveCount--;
                    scoreIncrease += 10;

                    const ballCenterX = g.ballX;
                    const ballCenterY = g.ballY;
                    const hairCenterX = h.x + HAIR_SIZE / 2;
                    const hairCenterY = h.y + HAIR_SIZE / 2;

                    const dx = ballCenterX - hairCenterX;
                    const dy = ballCenterY - hairCenterY;

                    if (Math.abs(dx) > Math.abs(dy)) {
                        g.ballDx = dx > 0 ? Math.abs(g.ballDx) : -Math.abs(g.ballDx);
                        g.ballX = dx > 0 ? h.x + HAIR_SIZE + BALL_R : h.x - BALL_R;
                    } else {
                        g.ballDy = dy > 0 ? Math.abs(g.ballDy) : -Math.abs(g.ballDy);
                        g.ballY = dy > 0 ? h.y + HAIR_SIZE + BALL_R : h.y - BALL_R;
                    }
                }
            }

            if (scoreIncrease > 0) {
                setScore((s) => s + scoreIncrease);
            }

            const justWon = g.aliveCount === 0;
            if (justWon) {
                g.stopped = true;
                setWon(true);
            }

            ctx.fillStyle = "#f1f0ec";
            ctx.fillRect(0, 0, cw, ch);

            if (hairImg) {
                for (let i = 0; i < g.hairs.length; i++) {
                    const h = g.hairs[i];
                    if (h.alive) {
                        ctx.drawImage(hairImg, h.x, h.y, HAIR_SIZE, HAIR_SIZE);
                    }
                }
            } else {
                ctx.fillStyle = "#573f33";
                for (let i = 0; i < g.hairs.length; i++) {
                    const h = g.hairs[i];
                    if (h.alive) {
                        ctx.fillRect(h.x, h.y, HAIR_SIZE, HAIR_SIZE);
                    }
                }
            }

            ctx.beginPath();
            ctx.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2);
            ctx.fillStyle = "#573f33";
            ctx.fill();

            const paddleX = g.finalPaddleX !== null ? g.finalPaddleX : g.paddleX;
            const headX = paddleX + (PADDLE_HIT_WIDTH - HEAD_SIZE) / 2;
            const headY = ch - HEAD_SIZE;
            const headImg = paddleImg;
            if (headImg) {
                ctx.drawImage(headImg, headX, headY, HEAD_SIZE, HEAD_SIZE);
            } else {
                ctx.fillStyle = "#573f33";
                ctx.fillRect(headX, headY, HEAD_SIZE, HEAD_SIZE);
            }
            if (justWon && hairImg) {
                ctx.drawImage(hairImg, headX, headY, HEAD_SIZE, HEAD_SIZE);
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

        const drawFinalFrame = (fallingY: number | null) => {
            ctx.fillStyle = "#f1f0ec";
            ctx.fillRect(0, 0, cw, ch);

            const hairImg = hairImgRef.current;
            if (hairImg) {
                for (let i = 0; i < g.hairs.length; i++) {
                    const h = g.hairs[i];
                    if (h.alive) {
                        ctx.drawImage(hairImg, h.x, h.y, HAIR_SIZE, HAIR_SIZE);
                    }
                }
            } else {
                ctx.fillStyle = "#573f33";
                for (let i = 0; i < g.hairs.length; i++) {
                    const h = g.hairs[i];
                    if (h.alive) {
                        ctx.fillRect(h.x, h.y, HAIR_SIZE, HAIR_SIZE);
                    }
                }
            }

            const headImg =
                gameOver && sadHeadImgRef.current ? sadHeadImgRef.current : paddleImgRef.current;
            if (headImg) {
                ctx.drawImage(headImg, headX, headY, HEAD_SIZE, HEAD_SIZE);
            }
            if (won && hairImgRef.current) {
                const drawY = fallingY !== null ? fallingY : headY;
                ctx.drawImage(hairImgRef.current, headX, drawY, HEAD_SIZE, HEAD_SIZE);
            }
        };

        if (won) {
            if (fallingHairYRef.current === null) {
                fallingHairYRef.current = -HEAD_SIZE;
            }

            const tick = () => {
                const currentY = fallingHairYRef.current;
                if (currentY === null) return;

                if (currentY >= headY) {
                    fallingHairYRef.current = headY;
                    fallingAnimIdRef.current = null;
                    drawFinalFrame(headY);
                    return;
                }

                fallingHairYRef.current = Math.min(currentY + FALLING_HAIR_SPEED, headY);
                drawFinalFrame(fallingHairYRef.current);
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !started || gameOver || won) return;

        const rectRef = { current: canvas.getBoundingClientRect() };
        let lastUpdateTime = 0;
        const throttleMs = 8;

        const updateRect = () => {
            rectRef.current = canvas.getBoundingClientRect();
        };

        const handleMove = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastUpdateTime < throttleMs) return;
            lastUpdateTime = now;

            const g = gameRef.current;
            if (!g || g.stopped) return;

            const rect = rectRef.current;
            const scaleX = canvas.width / rect.width;
            const x = (e.clientX - rect.left) * scaleX;
            g.paddleX = Math.max(
                0,
                Math.min(canvas.width - PADDLE_HIT_WIDTH, x - PADDLE_HIT_WIDTH / 2),
            );
        };

        const handleResize = () => {
            updateRect();
        };

        updateRect();
        canvas.addEventListener("mousemove", handleMove, { passive: true });
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", updateRect, true);

        return () => {
            canvas.removeEventListener("mousemove", handleMove);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", updateRect, true);
        };
    }, [started, gameOver, won]);

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
                width={800}
                height={500}
                className="max-w-full border-2 border-head-border bg-head-main"
                style={{ width: "min(800px, 100vw - 2rem)" }}
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
        </div>
    );
}
