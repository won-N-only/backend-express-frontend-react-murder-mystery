import React from "react";
import { LevelData } from "../types";

interface GameControlsProps {
    currentMoney: number;
    currentLevel: LevelData;
    handleEnhance: () => void;
    handleSell: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
    currentMoney,
    currentLevel,
    handleEnhance,
    handleSell,
}) => {
    const isEnhanceDisabled = currentMoney < currentLevel.cost;

    return (
        <div className="grid grid-cols-2 gap-2 w-full justify-center">
            <button
                onClick={handleEnhance}
                disabled={isEnhanceDisabled}
                className={`
                    w-full font-semibold text-base md:text-xl rounded-2xl
                    py-2.5 px-4 md:py-3 md:px-6
                    flex flex-col items-center
                    transition-colors
                    ${
                        isEnhanceDisabled
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-head-brown text-head-white hover:brightness-110"
                    }
                `}
            >
                강화하기
                <span className="text-sm md:text-base mt-1">
                    {isEnhanceDisabled ? "돈 부족" : `${currentLevel.cost.toLocaleString()} 원`}
                </span>
            </button>

            <button
                onClick={handleSell}
                className="w-full font-semibold text-base md:text-xl text-head-brown bg-head-white opacity-80 rounded-2xl py-2.5 px-4 md:py-3 md:px-6 flex flex-col items-center"
            >
                판매하기
                <span className="text-head-brown text-sm md:text-base mt-1">
                    {currentLevel.price.toLocaleString()} 원
                </span>
            </button>
        </div>
    );
};

export default GameControls;
