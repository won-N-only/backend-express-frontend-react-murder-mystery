import React from "react";

interface GameStartOverlayProps {
  onStartGame: () => void;
}

const GameStartOverlay: React.FC<GameStartOverlayProps> = ({ onStartGame }) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
      <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
        김감독 지각 방지 대작전
      </h2>
      <p className="mb-8 text-lg opacity-90">김감독이 모임에 늦지 않게 도와주세요!</p>
      <p className="mb-8 text-lg opacity-90">space로 점프하고 shift로 슬라이딩</p>
      <button
        onClick={onStartGame}
        className="bg-head-brown text-white text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg btn-standard-padding"
      >
        START
      </button>
    </div>
  );
};

export default GameStartOverlay;
