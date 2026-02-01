"use client";

import React, { forwardRef, useEffect } from "react";
import { Game } from "../game/Game";

interface GameCanvasProps {
    gameRef: React.MutableRefObject<Game | null>;
    isStarted: boolean;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(({ gameRef, isStarted }, ref) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const game = gameRef.current;
            if (!game) return;
            if (event.code === "Space") {
                event.preventDefault();
                game.jump();
            } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
                event.preventDefault();
                game.slide();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameRef]);

    useEffect(() => {
        const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        let animationFrameId: number;

        const gameLoop = () => {
            if (!isStarted || !gameRef.current) {
                animationFrameId = window.requestAnimationFrame(gameLoop);
                return;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);

            gameRef.current.update();
            gameRef.current.draw(context);

            animationFrameId = window.requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [ref, gameRef, isStarted]);

    return (
        <canvas
            ref={ref}
            width={800}
            height={480}
            className="bg-gray-100 block"
            style={{ maxHeight: "75vh", objectFit: "contain" }}
        />
    );
});

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
