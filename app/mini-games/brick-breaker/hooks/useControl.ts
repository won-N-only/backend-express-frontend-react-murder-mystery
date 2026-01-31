import { useEffect, useRef } from "react";
import { PADDLE_HIT_WIDTH } from "../constants";
import type { GameState } from "../types";

/**
 * 마우스와 터치 이벤트를 모두 지원하는 컨트롤 훅
 */
export function useControl(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    gameRef: React.MutableRefObject<GameState | null>,
    started: boolean,
    gameOver: boolean,
    won: boolean
) {
    const mouseXRef = useRef<number | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !started || gameOver || won) return;

        const updateRect = () => {
            rectRef.current = canvas.getBoundingClientRect();
        };

        // requestAnimationFrame을 사용하여 렌더링과 동기화
        const updatePaddleFromMouse = () => {
            const g = gameRef.current;
            if (!g || g.stopped || mouseXRef.current === null || rectRef.current === null) {
                rafIdRef.current = null;
                return;
            }

            const rect = rectRef.current;
            const scaleX = canvas.width / rect.width;
            const x = (mouseXRef.current - rect.left) * scaleX;
            g.paddleX = Math.max(
                0,
                Math.min(canvas.width - PADDLE_HIT_WIDTH, x - PADDLE_HIT_WIDTH / 2),
            );

            rafIdRef.current = null;
        };

        // 마우스 이벤트 핸들러 - 위치만 저장
        const handleMouseMove = (e: MouseEvent) => {
            mouseXRef.current = e.clientX;
            if (rafIdRef.current === null) {
                rafIdRef.current = requestAnimationFrame(updatePaddleFromMouse);
            }
        };

        // 터치 이벤트 핸들러
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault(); // 스크롤 방지
            if (e.touches.length > 0) {
                mouseXRef.current = e.touches[0].clientX;
                if (rafIdRef.current === null) {
                    rafIdRef.current = requestAnimationFrame(updatePaddleFromMouse);
                }
            }
        };

        const handleResize = () => {
            updateRect();
        };

        updateRect();

        // 마우스 이벤트 등록
        canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
        canvas.addEventListener("mouseenter", handleMouseMove, { passive: true });

        // 터치 이벤트 등록
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchstart", handleTouchMove, { passive: false });

        // 리사이즈 및 스크롤 이벤트
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", updateRect, true);

        return () => {
            // 모든 이벤트 리스너 제거
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseenter", handleMouseMove);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchstart", handleTouchMove);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", updateRect, true);

            // requestAnimationFrame 취소
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }

            // 참조 초기화
            mouseXRef.current = null;
        };
    }, [canvasRef, gameRef, started, gameOver, won]);
}
