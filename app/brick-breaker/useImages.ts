import { useEffect, useRef } from "react";

export function useImages() {
    const paddleImgRef = useRef<HTMLImageElement | null>(null);
    const sadHeadImgRef = useRef<HTMLImageElement | null>(null);
    const hairImgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const paddleImg = new Image();
        paddleImg.src = "/favicon_face.png";
        paddleImg.onload = () => {
            paddleImgRef.current = paddleImg;
        };

        const sadHeadImg = new Image();
        sadHeadImg.src = "/sad_head.png";
        sadHeadImg.onload = () => {
            sadHeadImgRef.current = sadHeadImg;
        };

        const hairImg = new Image();
        hairImg.src = "/favicon_hair.png";
        hairImg.onload = () => {
            hairImgRef.current = hairImg;
        };
    }, []);

    return { paddleImgRef, sadHeadImgRef, hairImgRef };
}
