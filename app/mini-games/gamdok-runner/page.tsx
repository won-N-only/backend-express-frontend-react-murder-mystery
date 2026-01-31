"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import { Game } from "./game/Game";

export default function GamdokRunnerPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);

    const [started, setStarted] = useState(false);
    const [gameStage, setGameStage] = useState<"dressUp" | "running">("dressUp");
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [lives, setLives] = useState(3); // Changed from health to lives

    // Clothing selection states
    const [selectedShoes, setSelectedShoes] = useState<string | null>(
        "/mini-games/gamdok-runner/shoes/shoes1.png",
    );
    const [selectedLowerBody, setSelectedLowerBody] = useState<string | null>(
        "/mini-games/gamdok-runner/lower-body/lowerbody1.png",
    );
    const [selectedUpperBody, setSelectedUpperBody] = useState<string | null>(
        "/mini-games/gamdok-runner/upper-body/upperbody1.png",
    );
    const [selectedHair, setSelectedHair] = useState<string | null>(
        "/mini-games/gamdok-runner/hair/hair1.png",
    );

    // Available clothing items (for selection UI)
    const availableShoes = ["/mini-games/gamdok-runner/shoes/shoes1.png"];
    const availableLowerBody = ["/mini-games/gamdok-runner/lower-body/lowerbody1.png"];
    const availableUpperBody = [
        "/mini-games/gamdok-runner/upper-body/upperbody1.png",
        "/mini-games/gamdok-runner/upper-body/upperbody2.png",
        "/mini-games/gamdok-runner/upper-body/upperbody3.png",
        "/mini-games/gamdok-runner/upper-body/upperbody4.png",
    ];
    const availableHair = [
        "/mini-games/gamdok-runner/hair/hair1.png",
        "/mini-games/gamdok-runner/hair/hair2.png",
        "/mini-games/gamdok-runner/hair/hair3.png",
        "/mini-games/gamdok-runner/hair/hair4.png",
        "/mini-games/gamdok-runner/hair/hair5.png",
        "/mini-games/gamdok-runner/hair/hair6.png",
        "/mini-games/gamdok-runner/hair/hair7.png",
        "/mini-games/gamdok-runner/hair/hair8.png",
    ];

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

    const startGame = () => {
        // Only start the running game if in dressUp stage
        if (gameStage === "dressUp") {
            setGameStage("running");
        }

        if (canvasRef.current && gameStage === "running") {
            const gameInstance = new Game(
                canvasRef.current,
                handleGameStateChange,
                selectedShoes,
                selectedLowerBody,
                selectedUpperBody,
                selectedHair, // Pass selected hair
            );
            gameRef.current = gameInstance;
            setStarted(true);
            setGameOver(false);
            setWon(false);
            setScore(0);
            setLives(3);
        }
    };

    const retryGame = () => {
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

                        {/* Dress Up Overlay */}
                        {gameStage === "dressUp" && (
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center text-black text-center p-4"
                                style={{
                                    backgroundImage: `url('/mini-games/gamdok-runner/room1.png')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
                                    김감독 코디 대작전
                                </h2>
                                <p className="mb-2 text-lg opacity-90">
                                    아무리 늦었어도 옷은입어야지
                                </p>
                                {/* Clothing Selection UI */}
                                <div className="flex flex-col gap-4 mb-8">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {availableHair.map((hair) => (
                                            <button
                                                key={hair}
                                                onClick={() => setSelectedHair(hair)}
                                                className={`p-2 border-2 bg-head-main ${selectedHair === hair ? "border-yellow-400" : "border-gray-400"} rounded-md`}
                                            >
                                                <img
                                                    src={hair}
                                                    alt="hair"
                                                    className="w-12 h-12 object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {availableUpperBody.map((ub) => (
                                            <button
                                                key={ub}
                                                onClick={() => setSelectedUpperBody(ub)}
                                                className={`p-2 border-2 bg-head-main ${selectedUpperBody === ub ? "border-yellow-400" : "border-gray-400"} rounded-md`}
                                            >
                                                <img
                                                    src={ub}
                                                    alt="upper body"
                                                    className="w-12 h-12 object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={startGame}
                                    className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95  rounded-none shadow-lg"
                                >
                                    달리기 시작!
                                </button>
                            </div>
                        )}

                        {/* Game Start Overlay (Only shown if gameStage is 'running' and not started yet) */}
                        {gameStage === "running" && !started && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                                <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
                                    김감독 지각 방지 대작전
                                </h2>
                                <p className="mb-8 text-lg opacity-90">
                                    김감독이 모임에 늦지 않게 도와주세요!
                                </p>
                                <p className="mb-8 text-lg opacity-90">
                                    space로 점프하고 shift로 슬라이딩
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
                                <div className="relative w-32 h-32 mx-auto mb-4 border border-gray-300 bg-white p-2">
                                    <img
                                        src="/mini-games/gamdok-runner/full-body.png"
                                        alt="Base Character"
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                    {selectedLowerBody && (
                                        <img
                                            src={selectedLowerBody}
                                            alt="Lower Body"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    )}
                                    {selectedUpperBody && (
                                        <img
                                            src={selectedUpperBody}
                                            alt="Upper Body"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    )}
                                    {selectedShoes && (
                                        <img
                                            src={selectedShoes}
                                            alt="Shoes"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    )}
                                    {selectedHair && (
                                        <img
                                            src={selectedHair}
                                            alt="Hair"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                                {selectedUpperBody ===
                                    "/mini-games/gamdok-runner/upper-body/upperbody4.png" && (
                                    <div
                                        className="absolute left-1/2 transform -translate-x-1/2 -top-4 sm:-top-8 p-2 bg-white text-black text-xs sm:text-sm rounded-lg shadow-lg z-10 w-32 sm:w-40"
                                        style={{ marginTop: "-4rem" }}
                                    >
                                        <p>이 날씨에 패딩 좀 더운디...</p>
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white -mb-2"></div>
                                    </div>
                                )}
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
