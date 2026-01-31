"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import { Game } from "./game/Game";

export default function GamdokRunnerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);

    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [lives, setLives] = useState(3); // Changed from health to lives

    const handleGameStateChange = useCallback(
        (newState: { score: number; lives: number; isGameOver: boolean }) => { // Changed from health to lives
            setScore(newState.score);
            setLives(newState.lives); // Changed from setHealth to setLives
            if (newState.isGameOver) {
                setGameOver(true);
            }
        },
        [],
    );

    const startGame = () => {
        if (canvasRef.current) {
            const gameInstance = new Game(canvasRef.current, handleGameStateChange);
            gameRef.current = gameInstance;
            setStarted(true);
            setGameOver(false);
            setWon(false);
            setScore(0);
            setLives(3); // Changed from setHealth to setLives
        }
    };

    const retryGame = () => {
        setGameOver(false);
        startGame();
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Placeholder useEffect for game loop (actual loop is in GameCanvas)
    useEffect(() => {
        if (started && !gameOver && !won) {
            // Logic to potentially reset game or handle ongoing state if needed outside of Game class
        }
    }, [started, gameOver, won]);

    return (
        <div className="min-h-screen bg-head-main flex flex-col items-center p-2 lg:p-8  ">
            <div className="w-full max-w-[1500px] flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-4 lg:gap-6">
                {/* 1. Game Area */}
                <div className="relative w-full lg:w-auto flex-shrink-0 flex justify-center">
                    <div className="rounded-none   shadow-2xl bg-head-gray-100   w-full">
                        <GameCanvas
                            ref={canvasRef}
                            gameRef={gameRef}
                            isStarted={started && !gameOver && !won}
                        />

                        {/* Start Overlay */}
                        {!started && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                                <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
                                    김감독 지각 방지 대작전
                                </h2>
                                <p className="mb-8 text-lg opacity-90">
                                    김감독이 회사에 늦지 않게 도와주세요!
                                </p>
                                <button
                                    onClick={startGame}
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                                >
                                    START
                                </button>
                            </div>
                        )}

                        {/* Stage Clear Overlay (Not applicable for Gamdok Runner yet, hidden) */}
                        {false && (
                            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                                <h2 className="text-5xl font-black mb-2 text-green-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                    STAGE CLEAR!
                                </h2>
                                <p className="text-xl mb-6 font-medium">다음 단계로 나아가세요!</p>

                                <button
                                    onClick={retryGame} // or start next stage if applicable
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
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
                                    김감독은 결국 지각하고 말았습니다...
                                </p>

                                <button
                                    onClick={retryGame}
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                                >
                                    RETRY
                                </button>
                            </div>
                        )}

                        {/* Win Overlay (Not applicable for Gamdok Runner yet, hidden) */}
                        {false && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-head-text text-center p-6  ">
                                <h2 className="text-4xl lg:text-5xl font-black mb-6 text-yellow-400 drop-shadow-md">
                                    ALL STAGES CLEAR!
                                </h2>
                                <p className="text-lg lg:text-xl mb-8 font-medium">축하합니다!</p>
                                <button
                                    onClick={startGame} // or restart game
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
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
                            <h1 className="text-3xl font-black text-head-text">김감독 러너</h1>
                        </div>

                        <div className="bg-head-gray-100 p-4 mx-4 mb-4   ">
                            <h3 className="font-bold text-head-brown mb-2 text-lg">💡 게임 설명</h3>
                            <ul className="text-sm text-head-text space-y-2 list-disc pl-4">
                                <li>장애물을 피해 목적지까지 달리세요.</li>
                                <li>
                                    <kbd>Space</kbd> 키를 눌러 점프하세요.
                                </li>
                                <li>
                                    <kbd>Shift</kbd> 키를 눌러 슬라이드하세요.
                                </li>
                                <li>장애물에 부딪히면 체력이 감소합니다.</li>
                                <li>구멍에 빠지면 게임오버!</li>
                            </ul>{" "}
                        </div>

                        {/* Score Card */}
                        <div className="bg-head-text text-white p-6  mt-auto">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                🏆 기록
                            </h3>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-300 text-sm">Score</span>
                                <span className="text-4xl font-black text-yellow-400">{score}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-gray-300 text-sm">Lives</span>
                                <span className="text-2xl font-bold text-green-400">{lives}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
