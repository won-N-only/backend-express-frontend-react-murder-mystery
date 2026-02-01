"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import DressUpOverlay from "./components/DressUpOverlay";
import GameCanvas from "./components/GameCanvas";
import GameOverOverlay from "./components/GameOverOverlay";
import GameStartOverlay from "./components/GameStartOverlay";
import { Game } from "./game/Game";

export default function GamdokRunnerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);

    const [started, setStarted] = useState(false);
    const [gameStage, setGameStage] = useState<"dressUp" | "running">("dressUp");
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [lives, setLives] = useState(3);

    // Clothing selection states
    const [selectedShoes, setSelectedShoes] = useState<string | null>(
        "/mini-games/gamdok-runner/shoes/shoes1.png",
    );
    const [selectedLowerBody, setSelectedLowerBody] = useState<string | null>(
        "/mini-games/gamdok-runner/lower-body/lowerbody1.png",
    );
    const [selectedUpperBody, setSelectedUpperBody] = useState<string | null>(null);
    const [selectedHair, setSelectedHair] = useState<string | null>(null);

    const handleGameStateChange = useCallback(
        (newState: { score: number; lives: number; isGameOver: boolean }) => {
            setScore(newState.score);
            setLives(newState.lives);
            if (newState.isGameOver) {
                setGameOver(true);
            }
        },
        [],
    );

    const initializeGame = useCallback(async () => {
        if (canvasRef.current) {
            try {
                const gameInstance = new Game(
                    canvasRef.current,
                    handleGameStateChange,
                    selectedShoes,
                    selectedLowerBody,
                    selectedUpperBody,
                    selectedHair,
                );
                gameRef.current = gameInstance;
                await gameRef.current.init(); // Initialize the game after assets are loaded
                setStarted(true);
                setGameOver(false);
                setWon(false);
                setScore(0);
                setLives(3);
            } catch (error) {
                console.error("Game failed to initialize:", error);
                setGameOver(true);
                setStarted(false);
            }
        }
    }, [
        canvasRef,
        handleGameStateChange,
        selectedHair,
        selectedLowerBody,
        selectedShoes,
        selectedUpperBody,
    ]);

    const startGame = () => {
        // Transition from dressUp to running stage
        if (gameStage === "dressUp") {
            setGameStage("running");
            return; // Exit here, actual game initialization happens after the overlay
        }

        // Initialize the game only when gameStage is 'running' and not yet started
        if (gameStage === "running" && !started) {
            initializeGame();
        }
    };

    const retryGame = () => {
        if (gameRef.current) {
            gameRef.current = null;
        }
        setGameOver(false);
        setStarted(false); // Reset started to false to show start overlay again
        setGameStage("dressUp"); // Go back to dress up stage
        setScore(0);
        setLives(3);
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

    const handleJumpTouch = useCallback(() => {
        if (gameRef.current && started && !gameOver && !won && gameStage === "running") {
            gameRef.current.jump();
        }
    }, [started, gameOver, won, gameStage]);

    const handleSlideTouch = useCallback(() => {
        if (gameRef.current && started && !gameOver && !won && gameStage === "running") {
            gameRef.current.slide();
        }
    }, [started, gameOver, won, gameStage]);

    return (
        <div className="min-h-screen bg-head-main flex flex-col items-center p-2 lg:p-8  ">
            <div className="w-full max-w-[1500px] flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-2 lg:gap-6">
                {/* 1. Game Area */}
                <div className="relative w-full lg:w-auto flex-shrink-0 flex justify-center">
                    <div className="rounded-none   shadow-2xl bg-head-gray-100   w-full">
                        <GameCanvas
                            ref={canvasRef}
                            gameRef={gameRef}
                            isStarted={started && !gameOver && !won && gameStage === "running"}
                        />

                        {/* Touch Controls */}
                        {gameStage === "running" && started && !gameOver && !won && (
                            <div className="absolute bottom-4 w-full flex justify-around md:hidden">
                                <button
                                    onClick={handleSlideTouch}
                                    className="bg-gray-800 text-white p-4 rounded-full w-24 h-24 flex items-center justify-center text-xl font-bold opacity-80"
                                >
                                    Slide
                                </button>
                                <button
                                    onClick={handleJumpTouch}
                                    className="bg-gray-800 text-white p-4 rounded-full w-24 h-24 flex items-center justify-center text-xl font-bold opacity-80"
                                >
                                    Jump
                                </button>
                            </div>
                        )}

                        {/* Dress Up Overlay */}
                        {gameStage === "dressUp" && (
                            <DressUpOverlay
                                selectedShoes={selectedShoes}
                                setSelectedShoes={setSelectedShoes}
                                selectedLowerBody={selectedLowerBody}
                                setSelectedLowerBody={setSelectedLowerBody}
                                selectedUpperBody={selectedUpperBody}
                                setSelectedUpperBody={setSelectedUpperBody}
                                selectedHair={selectedHair}
                                setSelectedHair={setSelectedHair}
                                onStartGame={startGame}
                            />
                        )}

                        {/* Game Start Overlay (Only shown if gameStage is 'running' and not started yet) */}
                        {gameStage === "running" && !started && (
                            <GameStartOverlay onStartGame={startGame} />
                        )}

                        {/* Game Over Overlay */}
                        {gameOver && <GameOverOverlay onRetryGame={retryGame} />}
                    </div>
                </div>

                {/* 2. Sidebar / Info (Right Side) */}
                <div className="w-full lg:w-[350px] shrink-0  ">
                    {/* Game Info Card */}
                    <div className="bg-head-white shadow-xl border border-head-border flex flex-col h-full w-full">
                        <div className="flex justify-between items-start p-6">
                            <h1 className="text-3xl font-black text-head-text">김감독 러너</h1>
                        </div>
                        {gameStage === "dressUp" && (
                            <div className="bg-head-gray-100 p-4 mx-4 mb-4">
                                <h3 className="font-bold text-head-brown mb-2 text-lg">
                                    선택된 코디
                                </h3>

                                {/* Combined Avatar Preview */}
                                <div className="relative w-56 h-56 mx-auto mb-4 border border-gray-300 bg-white p-2">
                                    <Image
                                        src="/mini-games/gamdok-runner/full-body.png"
                                        alt="Base Character"
                                        className="absolute inset-0 w-full h-full object-contain"
                                        width={192}
                                        height={192}
                                    />
                                    {selectedLowerBody && (
                                        <Image
                                            src={selectedLowerBody}
                                            alt="Lower Body"
                                            className="absolute inset-0 w-full h-full object-contain"
                                            width={192}
                                            height={192}
                                        />
                                    )}
                                    {selectedUpperBody && (
                                        <Image
                                            src={selectedUpperBody}
                                            alt="Upper Body"
                                            className="absolute inset-0 w-full h-full object-contain"
                                            width={192}
                                            height={192}
                                        />
                                    )}
                                    {selectedShoes && (
                                        <Image
                                            src={selectedShoes}
                                            alt="Shoes"
                                            className="absolute inset-0 w-full h-full object-contain"
                                            width={192}
                                            height={192}
                                        />
                                    )}
                                    {selectedHair && (
                                        <Image
                                            src={selectedHair}
                                            alt="Hair"
                                            className="absolute inset-0 w-full h-full object-contain"
                                            width={192}
                                            height={192}
                                        />
                                    )}
                                    {selectedUpperBody ===
                                        "/mini-games/gamdok-runner/upper-body/upperbody4.png" && (
                                        <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 p-2 bg-white text-black text-xs sm:text-sm rounded-lg shadow-lg z-20 w-32 sm:w-40">
                                            <p>이 날씨에 패딩 좀 더운디...</p>
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white -mb-2"></div>
                                        </div>
                                    )}
                                </div>
                                {/* Clothing Selection UI */}
                            </div>
                        )}
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
