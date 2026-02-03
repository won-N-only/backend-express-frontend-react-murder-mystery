import React from "react";
import { LevelData } from "../types";

interface GameControlsProps {
    currentLevel: LevelData;
    handleEnhance: () => void;
    handleSell: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ currentLevel, handleEnhance, handleSell }) => {
    return (
        <div className="flex gap-4 w-full justify-center">
            <button
                onClick={handleEnhance}
                className="w-full font-semibold text-base md:text-xl text-head-white bg-head-brown rounded-2xl py-2.5 px-4 md:py-3 md:px-6 flex flex-col items-center"
            >
                강화하기
                <span className="text-head-white text-sm md:text-base mt-1">
                    {currentLevel.cost} 원
                </span>
            </button>

            <button
                onClick={handleSell}
                className="w-full font-semibold text-base md:text-xl text-head-brown bg-head-white opacity-80 rounded-2xl py-2.5 px-4 md:py-3 md:px-6 flex flex-col items-center"
            >
                판매하기
                <span className="text-head-brown text-sm md:text-base mt-1">
                    {currentLevel.price} 원
                </span>
            </button>
        </div>
    );
};

export default GameControls;
