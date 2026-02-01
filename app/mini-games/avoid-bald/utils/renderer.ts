import { MutableRefObject } from "react";
import { GameObject } from "../types";

export const drawGame = (
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    playerRef: MutableRefObject<GameObject>,
    obstaclesRef: MutableRefObject<GameObject[]>,
    playerImgRef: MutableRefObject<HTMLImageElement | null>,
    obstacleImgRef: MutableRefObject<HTMLImageElement | null>,
    score: number
) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 배경
    ctx.fillStyle = "#f3f4f6"; // bg-head-gray-100
    ctx.fillRect(0, 0, width, height);

    // 장애물 그리기
    const oImg = obstacleImgRef.current;
    const oReady = oImg && oImg.complete;

    ctx.fillStyle = "#FF0000"; // fallback
    for (const obs of obstaclesRef.current) {
        if (oReady) {
            ctx.drawImage(oImg, obs.x, obs.y, obs.width, obs.height);
        } else {
            ctx.beginPath();
            ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 플레이어 그리기
    const p = playerRef.current;
    if (playerImgRef.current && playerImgRef.current.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(playerImgRef.current, p.x, p.y, p.width, p.height);
        ctx.restore();

        // 테두리
        ctx.beginPath();
        ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 3;
        ctx.stroke();
    } else {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    // 점수 표시
    ctx.fillStyle = "#374151";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${Math.floor(score / 10)}`, 40, 80);
};
