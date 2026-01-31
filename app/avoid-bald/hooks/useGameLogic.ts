import { useCallback, useEffect, useRef, useState } from "react";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    INITIAL_SPAWN_RATE,
    OBSTACLE_SIZE,
    PLAYER_SIZE,
} from "../constants";
import { GameObject, GameState } from "../types";
import { drawGame } from "../utils/renderer";

export const useGameLogic = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>("start");
    const [finalScore, setFinalScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const [isSkinUnlocked, setIsSkinUnlocked] = useState(false);
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
        const pImg = new Image();
        pImg.src = playerSkin;
        playerImgRef.current = pImg;
    }, [playerSkin]);

    useEffect(() => {
        const oImg = new Image();
        oImg.src = "/sad_head.png";
        obstacleImgRef.current = oImg;
    }, []);

    const gameOver = useCallback(() => {
        setGameState("gameover");
        const currentScore = Math.floor(scoreRef.current / 10);
        setFinalScore(currentScore);
        if (currentScore > highScore) {
            setHighScore(currentScore);
        }
    }, [highScore]);

    const gameClear = useCallback(() => {
        setGameState("clear");
        const currentScore = 200;
        setFinalScore(currentScore);
        if (currentScore > highScore) {
            setHighScore(currentScore);
        }
    }, [highScore]);

    const update = useCallback(() => {
        if (gameState !== "playing") return;

        frameCountRef.current++;
        scoreRef.current++;

        // 승리 조건
        if (!isSkinUnlockedRef.current && scoreRef.current >= 2000) {
            gameClear();
            return;
        }

        // 난이도 조절
        const isHardMode = scoreRef.current >= 2000;
        let currentSpawnRate, speedBase, sizeMin, sizeMax;

        if (isHardMode) {
            currentSpawnRate = Math.max(8, 12 - Math.floor((scoreRef.current - 2000) / 1000));
            speedBase = 6 + scoreRef.current / 600;
            sizeMin = 40;
            sizeMax = 80;
        } else { // scoreRef.current < 2000
            if (scoreRef.current < 200) { // New tier for very early game
                currentSpawnRate = Math.max(10, INITIAL_SPAWN_RATE - 30); // More frequent spawns
                speedBase = 6; // Faster initial speed
                sizeMin = 40; // Larger initial obstacles
                sizeMax = 60;
            } else { // Original logic for 200 <= scoreRef.current < 2000
                const difficultyMultiplier = Math.floor(scoreRef.current / 500);
                currentSpawnRate = Math.max(8, INITIAL_SPAWN_RATE - difficultyMultiplier * 3);
                speedBase = 4 + scoreRef.current / 500;
                sizeMin = 30;
                sizeMax = 40 + Math.min(30, Math.floor(scoreRef.current / 1000) * 5);
            }
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
    }, [gameState, gameClear, gameOver]);

    const startGame = useCallback(() => {
        // 최고 점수가 200점 이상이면 하드 모드(2000점)로 시작
        const isHardStart = highScore >= 200;
        scoreRef.current = isHardStart ? 2000 : 0;
        frameCountRef.current = 0;
        obstaclesRef.current = [];
        playerRef.current.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;

        // 하드 모드 시작 시 스킨 해금 상태로 시작 (즉시 클리어 화면 뜨는 것 방지)
        setIsSkinUnlocked(isHardStart);
        isSkinUnlockedRef.current = isHardStart;
        setPlayerSkin(isHardStart ? "/sad_head.png" : "/thumbnail.png");

        setGameState("playing");
    }, [highScore]);

    const continueGame = useCallback(() => {
        setIsSkinUnlocked(true);
        isSkinUnlockedRef.current = true;
        setPlayerSkin("/sad_head.png");
        setGameState("playing");
    }, []);

    // Game Loop Effect
    useEffect(() => {
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
    }, [gameState, update]);

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
