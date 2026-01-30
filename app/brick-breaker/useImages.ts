import { useEffect, useRef, useState } from "react";

export function useImages() {
    const paddleImgRef = useRef<HTMLImageElement | null>(null);
    const sadHeadImgRef = useRef<HTMLImageElement | null>(null);
    const hairImgRef = useRef<HTMLImageElement | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const totalImages = 3;

        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setImagesLoaded(true);
            }
        };

        const paddleImg = new Image();
        paddleImg.src = "/favicon_face.png";
        paddleImg.onload = () => {
            paddleImgRef.current = paddleImg;
            checkAllLoaded();
        };
        paddleImg.onerror = checkAllLoaded;

        const sadHeadImg = new Image();
        sadHeadImg.src = "/sad_head.png";
        sadHeadImg.onload = () => {
            sadHeadImgRef.current = sadHeadImg;
            checkAllLoaded();
        };
        sadHeadImg.onerror = checkAllLoaded;

        const hairImg = new Image();
        hairImg.src = "/favicon_hair.png";
        hairImg.onload = () => {
            hairImgRef.current = hairImg;
            checkAllLoaded();
        };
        hairImg.onerror = checkAllLoaded;
    }, []);

    return { paddleImgRef, sadHeadImgRef, hairImgRef, imagesLoaded };
}
