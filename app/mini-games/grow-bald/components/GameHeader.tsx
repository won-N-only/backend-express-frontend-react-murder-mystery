import React from "react";

interface GameHeaderProps {
    money: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ money }) => {
    return (
        <>
            {/* 타이틀 */}
            <div className="text-lg md:text-xl font-semibold text-head-white py-1.5 px-4 md:py-2 md:px-6 bg-head-brown rounded-full">
                대머리 강화하기
            </div>
            <div className="text-xl md:text-2xl font-bold text-head-text">
                최고의 대머리로 강화하세요!
            </div>
            {/* 돈 */}
            <div className="w-full flex justify-end font-semibold text-sm md:text-lg text-head-brown">
                <span className="text-head-white bg-head-brown text-bold px-1.5 rounded-full mr-2">
                    ₩
                </span>
                {money} 원
            </div>
        </>
    );
};

export default GameHeader;
