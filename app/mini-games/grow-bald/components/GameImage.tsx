import Image from "next/image";
import React from "react";
import { LevelData } from "../types";

interface GameImageProps {
    level: number;
    currentLevel: LevelData;
    pulse: boolean;
    spin: boolean;
    handleHeadClick: (e: React.MouseEvent<HTMLImageElement>) => void;
}

const GameImage: React.FC<GameImageProps> = ({
    level,
    currentLevel,
    pulse,
    spin,
    handleHeadClick,
}) => {
    return (
        <Image
            src={`/mini-games/grow-bald/level/head/level_${level}.png`}
            alt={currentLevel.item_name}
            width={250}
            height={250}
            onClick={handleHeadClick}
            draggable={false}
            className={`w-56 md:w-56 aspect-square transition-transform cursor-pointer ${
                spin ? "animate-spin-full" : pulse ? "animate-pulse" : "animate-tilt-spin"
            }`}
        />
    );
};

export default GameImage;
