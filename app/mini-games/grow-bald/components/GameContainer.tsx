import React from "react";

interface GameContainerProps {
    children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ children }) => {
    return (
        <div className="flex flex-col items-center w-full px-6 py-16 gap-6 max-w-lg mx-auto bg-[url('/mini-games/grow-bald/background.png')] bg-cover bg-center select-none">
            {children}
        </div>
    );
};

export default GameContainer;
