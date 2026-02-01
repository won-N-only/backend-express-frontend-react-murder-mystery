import { useCallback, useEffect, useRef, useState } from "react";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    OBSTACLE_SIZE,
    PLAYER_SIZE
} from "../constants";
import { GameObject, GameState } from "../types";
import { drawGame } from "../utils/renderer";

export const useGameLogic = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>("start");
    const [finalScore, setFinalScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const [imagesLoaded, setImagesLoaded] = useState(false);


    const [playerSkin, setPlayerSkin] = useState("/thumbnail.png");

    const requestRef = useRef<number>();
    const frameCountRef = useRef(0);
    const scoreRef = useRef(0);
    const isSkinUnlockedRef = useRef(false);

    const playerRef = useRef<GameObject>({
        x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
        y: CANVAS_HEIGHT - PLAYER_SIZE - 20,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
    });

    const obstaclesRef = useRef<GameObject[]>([]);
    const playerImgRef = useRef<HTMLImageElement | null>(null);
    const obstacleImgRef = useRef<HTMLImageElement | null>(null);

    // Asset Loading
    useEffect(() => {
        let loadedCount = 0;
        const totalImages = 2; // Player and obstacle

        const loadImage = (src: string, ref: React.MutableRefObject<HTMLImageElement | null>) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    ref.current = img;
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${src}`);
                    // Still count even if failed to allow other images to load
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                    resolve(); // Resolve even on error to not block other images
                };
            });
        };

        // Reset loaded state when playerSkin changes
        setImagesLoaded(false);

        loadImage(playerSkin, playerImgRef);
        loadImage("/sad_head.png", obstacleImgRef);

    }, [playerSkin]);

    const gameOver = useCallback(() => {
        setGameState("gameover");
        const currentScore = Math.floor(scoreRef.current / 10);
        setFinalScore(currentScore);
        setHighScore(prevHighScore => Math.max(prevHighScore, currentScore));
    }, []);


    const gameClear = useCallback(() => {
        setGameState("clear");
        const currentScore = Math.floor(scoreRef.current / 10);
        setFinalScore(currentScore);
        setHighScore(prevHighScore => Math.max(prevHighScore, currentScore));
    }, []);

    const gameEndingClear = useCallback(() => {
        setGameState("endingClear");
        const currentScore = Math.floor(scoreRef.current / 10);
        setFinalScore(currentScore);
        setHighScore(prevHighScore => Math.max(prevHighScore, currentScore));
    }, []);

    const update = useCallback(() => {
        if (gameState !== "playing") return;

        frameCountRef.current++;
        scoreRef.current += 1.5;

        // 승리 조건
        if (!isSkinUnlockedRef.current && scoreRef.current >= 8000) {
            gameEndingClear();
            return;
        }
        if (!isSkinUnlockedRef.current && scoreRef.current >= 2000) {
            gameClear();
            return;
        }

        // 난이도 조절
        const isHardMode = scoreRef.current >= 2000;
        const isEndingMode = scoreRef.current >= 8000;

        let currentSpawnRate, speedBase, sizeMin, sizeMax;

        if (isEndingMode) { // Even harder mode for ending clear
            currentSpawnRate = Math.max(1, 10 - Math.floor((scoreRef.current - 8000) / 1000));
            speedBase = 10 + scoreRef.current / 300;
            sizeMin = 60;
            sizeMax = 130;
        } else if (isHardMode) {
            currentSpawnRate = Math.max(3, 15 - Math.floor((scoreRef.current - 2000) / 800));
            speedBase = 6 + scoreRef.current / 400;
            sizeMin = 50;
            sizeMax = 110;
        } else { // scoreRef.current < 2000
            currentSpawnRate = 20; // More frequent spawns
            speedBase = 4; // Faster initial speed
            sizeMin = 40; // Larger initial obstacles
            sizeMax = 80;
        }

        // 장애물 생성
        if (frameCountRef.current % currentSpawnRate === 0) {
            const randomX = Math.random() * (CANVAS_WIDTH - OBSTACLE_SIZE);
            const randomSize = sizeMin + Math.random() * (sizeMax - sizeMin);
            const speedVar = Math.random() * 4;
            const finalSpeed = speedBase + speedVar;

            obstaclesRef.current.push({
                x: randomX,
                y: -randomSize,
                width: randomSize,
                height: randomSize,
                speed: finalSpeed,
            });
        }

        // 이동 및 충돌
        const player = playerRef.current;
        const hitboxPadding = 15;
        let collision = false;

        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
            const obs = obstaclesRef.current[i];
            if (obs.speed) obs.y += obs.speed;

            if (obs.y > CANVAS_HEIGHT) {
                obstaclesRef.current.splice(i, 1);
                continue;
            }

            if (
                !collision &&
                player.x + hitboxPadding < obs.x + obs.width - hitboxPadding &&
                player.x + player.width - hitboxPadding > obs.x + hitboxPadding &&
                player.y + hitboxPadding < obs.y + obs.height - hitboxPadding &&
                player.y + player.height - hitboxPadding > obs.y + hitboxPadding
            ) {
                collision = true;
            }
        }

        if (collision) {
            gameOver();
            return;
        }

        drawGame(
            canvasRef,
            playerRef,
            obstaclesRef,
            playerImgRef,
            obstacleImgRef,
            scoreRef.current
        );
        requestRef.current = requestAnimationFrame(update);
    }, [gameState, gameClear, gameOver, gameEndingClear]);

    const startGame = useCallback(() => {
        // 최고 점수에 따라 시작 모드 결정
        let initialScore = 0;
        let unlockSkin = false;
        let playerStartingSkin = "/thumbnail.png";

        if (highScore >= 800) {
            initialScore = 8000; // 800점 엔딩 클리어 모드
            unlockSkin = true;
            playerStartingSkin = "/sad_head.png";
        } else if (highScore >= 200) {
            initialScore = 2000; // 200점 하드 모드
            unlockSkin = true;
            playerStartingSkin = "/sad_head.png";
        } else {
            initialScore = 0; // 일반 모드
            unlockSkin = false;
            playerStartingSkin = "/thumbnail.png";
        }

        scoreRef.current = initialScore;
        frameCountRef.current = 0;
        obstaclesRef.current = [];
        playerRef.current.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;


        isSkinUnlockedRef.current = unlockSkin;
        setPlayerSkin(playerStartingSkin);

        setGameState("playing");
    }, [highScore]);

    const continueGame = useCallback(() => {

        isSkinUnlockedRef.current = true;
        setPlayerSkin("/sad_head.png");
        setGameState("playing");
    }, []);

    // Game Loop Effect
    useEffect(() => {
        if (!imagesLoaded) {
            // If images are not loaded, cancel any ongoing animation and return
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return;
        }

        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(update);
        } else if (gameState === "start") {
            // 초기 화면 그리기
            drawGame(
                canvasRef,
                playerRef,
                obstaclesRef,
                playerImgRef,
                obstacleImgRef,
                scoreRef.current
            );
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, update, imagesLoaded]);

    const updatePlayerPosition = useCallback((clientX: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let targetX = (clientX - rect.left) * scaleX;
        let newX = targetX - PLAYER_SIZE / 2;

        if (newX < 0) newX = 0;
        if (newX > CANVAS_WIDTH - PLAYER_SIZE) newX = CANVAS_WIDTH - PLAYER_SIZE;

        playerRef.current.x = newX;
    }, []);

    return {
        canvasRef,
        gameState,
        finalScore,
        highScore,
        startGame,
        continueGame,
        updatePlayerPosition,
    };
};
