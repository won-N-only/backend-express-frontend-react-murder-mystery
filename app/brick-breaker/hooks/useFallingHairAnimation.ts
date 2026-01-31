import { useCallback, useEffect, useRef } from "react";
import { FALLING_HAIR_SPEED, HEAD_SIZE, PADDLE_HIT_WIDTH } from "../constants";
import type { Hair } from "../types";
import { clearCanvas, drawFallingHair, drawHairs, drawPaddle } from "../utils/gameRenderer";

interface UseFallingHairAnimationProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
    paddleX: number;
    canvasHeight: number;
    canvasWidth: number;
    sadHeadImg: HTMLImageElement | null;
    paddleImg: HTMLImageElement | null;
    hairImg: HTMLImageElement | null;
    gameOver: boolean;
    won: boolean;
    hairs: Hair[];
}

export const useFallingHairAnimation = ({
    canvasRef,
    ctxRef,
    paddleX,
    canvasHeight,
    canvasWidth,
    sadHeadImg,
    paddleImg,
    hairImg,
    gameOver,
    won,
    hairs,
}: UseFallingHairAnimationProps) => {
    const fallingHairYRef = useRef<number | null>(null);
    const fallingAnimIdRef = useRef<number | null>(null);

    const drawFinalFrame = useCallback(
        (currentFallingY: number | null, rotationAngle: number = 0) => {
            const ctx = ctxRef.current;
            if (!ctx) return;

            const headX = paddleX + (PADDLE_HIT_WIDTH - HEAD_SIZE) / 2;
            const headY = canvasHeight - HEAD_SIZE;
            const hairStopY = headY;

            clearCanvas(ctx, canvasWidth, canvasHeight);
            drawHairs(ctx, hairs, hairImg);

            const headImg = gameOver && sadHeadImg ? sadHeadImg : paddleImg;
            if (headImg) {
                ctx.drawImage(headImg, headX, headY, HEAD_SIZE, HEAD_SIZE);
            }
            if (won && hairImg) {
                const drawY = currentFallingY !== null ? currentFallingY : hairStopY;
                drawFallingHair(ctx, paddleX, canvasHeight, drawY, rotationAngle, hairImg);
            }
        },
        [
            ctxRef,
            paddleX,
            canvasHeight,
            canvasWidth,
            gameOver,
            sadHeadImg,
            paddleImg,
            won,
            hairImg,
            hairs,
        ],
    );

    const startFallingHairAnimation = useCallback(() => {
        const ctx = ctxRef.current;
        if (!ctx || !won) return;

        const headY = canvasHeight - HEAD_SIZE;
        const hairStopY = headY;

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

        if (fallingAnimIdRef.current) {
            cancelAnimationFrame(fallingAnimIdRef.current);
        }
        fallingAnimIdRef.current = requestAnimationFrame(tick);

    }, [ctxRef, won, canvasHeight, drawFinalFrame]);

    // Initial render / when won state changes
    useEffect(() => {
        if (!won) {
            // Reset state if game is not won
            fallingHairYRef.current = null;
            if (fallingAnimIdRef.current) {
                cancelAnimationFrame(fallingAnimIdRef.current);
                fallingAnimIdRef.current = null;
            }
        }
        if (won && !fallingAnimIdRef.current) {
            startFallingHairAnimation();
        }
    }, [won, startFallingHairAnimation]);


    // Cleanup
    useEffect(() => {
        return () => {
            if (fallingAnimIdRef.current != null) {
                cancelAnimationFrame(fallingAnimIdRef.current);
            }
        };
    }, []);

    return { startFallingHairAnimation };
};