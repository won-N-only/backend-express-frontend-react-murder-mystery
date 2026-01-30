import { useEffect, useRef } from "react";
import { PADDLE_HIT_WIDTH } from "./constants";
import type { GameState } from "./types";

export function useMouseControl(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    gameRef: React.MutableRefObject<GameState | null>,
    started: boolean,
    gameOver: boolean,
    won: boolean
) {
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
    }, [canvasRef, gameRef, started, gameOver, won]);
}
