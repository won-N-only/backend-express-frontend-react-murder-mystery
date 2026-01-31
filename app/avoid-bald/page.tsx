"use client";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { useGameLogic } from "./hooks/useGameLogic";

export default function AvoidBaldGame() {
    const {
        canvasRef,
        gameState,
        finalScore,
        highScore,
        startGame,
        continueGame,
        updatePlayerPosition,
    } = useGameLogic();

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameState !== "playing") return;
        updatePlayerPosition(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (gameState !== "playing") return;
        updatePlayerPosition(e.touches[0].clientX);
    };

    return (
        <div className="min-h-screen bg-head-main flex flex-col items-center p-2 lg:p-8">
            <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12">
                {/* 1. Game Area */}
                <div className="relative w-full lg:w-auto flex-shrink-0 flex justify-center">
                    <div className="rounded-none   shadow-2xl bg-head-gray-100 overflow-hidden w-full max-w-[600px]">
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            onMouseMove={handleMouseMove}
                            onTouchMove={handleTouchMove}
                            onTouchStart={handleTouchMove}
                            className="block cursor-none touch-none w-full h-auto bg-head-gray-100"
                            style={{
                                maxHeight: "75vh",
                                objectFit: "contain",
                            }}
                        />
                    </div>

                    {/* Start Overlay */}
                    {gameState === "start" && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
                                대머리 피하기
                            </h2>
                            <p className="mb-8 text-lg opacity-90">
                                쏟아지는 대머리 친구들을 피하세요!
                            </p>
                            <hr className="border-head-gray-500 opacity-40 my-2 text-4xl" />
                            <p className="text-head-whtie text-4xl font-bold">CLEAR: 200점</p>
                            <hr className="border-head-gray-500 opacity-40 my-2 text-4xl" />
                            <button
                                onClick={startGame}
                                className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                            >
                                START
                            </button>
                        </div>
                    )}

                    {/* Game Over Overlay */}
                    {gameState === "gameover" && (
                        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
                            <h2 className="text-5xl font-black mb-2 text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                GAME OVER
                            </h2>
                            <p className="text-xl mb-4 font-medium">
                                당신은 대머리가 되었습니다...
                            </p>

                            <img
                                src="/sad_head.png"
                                alt="Sad Head"
                                className="w-24 h-24 mb-6 animate-bounce"
                            />

                            <div className="bg-white text-black p-8 mb-8 border-4 border-head-brown rounded-none shadow-2xl min-w-[240px]">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                                    Final Score
                                </p>
                                <p className="text-6xl font-black text-head-brown">{finalScore}</p>
                            </div>

                            <button
                                onClick={startGame}
                                className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg"
                            >
                                다시 하기
                            </button>
                        </div>
                    )}

                    {/* Game Clear Overlay */}
                    {gameState === "clear" && (
                        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-white text-center p-6 backdrop-blur-md">
                            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-yellow-400 drop-shadow-md">
                                CLEAR!
                            </h2>
                            <p className="text-lg lg:text-xl mb-6 font-medium leading-relaxed max-w-lg break-keep">
                                대머리가 당신에게 무슨짓을 햇길래 이렇게 악착같이 피하시는건가요...{" "}
                                <br />
                                실망햇습니다 .. <br />
                                <span className="text-red-400 font-bold mt-2 block">
                                    당신은 마음마저 대머리가 되었습니다.!!
                                </span>
                            </p>

                            <img
                                src="/sad_head.png"
                                alt="Sad Head"
                                className="w-32 h-32 mb-8 animate-pulse"
                            />

                            <div className="flex gap-4 flex-col sm:flex-row">
                                <button
                                    onClick={continueGame}
                                    className="bg-head-brown text-white px-6 py-3 text-lg font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg animate-bounce whitespace-nowrap"
                                >
                                    계속 하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Sidebar / Description (Right Side) */}
                <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
                    {/* Game Info Card */}
                    <div className="bg-head-white   p-6 shadow-lg rounded-none">
                        <h1 className="text-3xl font-black text-head-text mb-2   pb-2">
                            대머리 피하기
                        </h1>
                        <div className="text-head-text mb-4 leading-relaxed font-medium">
                            하늘에서 끊임없이 떨어지는 &apos;슬픈 대머리&apos;들을 피해서 풍성한
                            머리카락을 지켜내세요!
                        </div>
                        <div className="bg-head-gray-100 p-4 mx-4 mb-4   ">
                            <h3 className="font-bold text-head-brown mb-2 text-lg">💡 조작 방법</h3>
                            <ul className="text-sm text-head-text space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="bg-head-brown text-white px-2 py-0.5 text-xs font-bold rounded-none">
                                        PC
                                    </span>
                                    마우스 이동으로 캐릭터 조종
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="bg-head-brown text-white px-2 py-0.5 text-xs font-bold rounded-none">
                                        Mobile
                                    </span>
                                    화면 터치 & 드래그
                                </li>
                            </ul>
                        </div>

                        <div className="text-xs text-gray-500">
                            * 시간이 지날수록 대머리들이 더 빠르고 많이 떨어집니다.
                        </div>
                    </div>

                    {/* Score Card */}
                    <div className="bg-head-text text-white   p-6 shadow-lg rounded-none">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🏆 기록 보관실
                        </h3>
                        <div className="flex justify-between items-end border-b border-gray-600 pb-2 mb-2">
                            <span className="text-gray-300 text-sm">내 최고 기록</span>
                            <span className="text-3xl font-bold text-yellow-400">{highScore}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
