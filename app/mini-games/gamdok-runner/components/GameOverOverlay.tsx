import React from "react";

interface GameOverOverlayProps {
  onRetryGame: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ onRetryGame }) => {
  return (
    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-center p-4 backdrop-blur-sm">
      <h2 className="text-5xl font-black mb-2 text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        GAME OVER
      </h2>
      <p className="text-xl mb-6 font-medium">
        김감독은 결국 지각하고 말았습니다...
      </p>

      <button
        onClick={onRetryGame}
        className="bg-head-brown text-white text-2xl font-bold hover:opacity-90 transition-transform active:scale-95 border-4 border-white rounded-none shadow-lg btn-standard-padding"
      >
        RETRY
      </button>
    </div>
  );
};

export default GameOverOverlay;
