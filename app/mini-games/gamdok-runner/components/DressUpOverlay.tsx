import React from "react";
import DressUpSelection from "./DressUpSelection";

interface DressUpOverlayProps {
  selectedShoes: string | null;
  setSelectedShoes: (path: string | null) => void;
  selectedLowerBody: string | null;
  setSelectedLowerBody: (path: string | null) => void;
  selectedUpperBody: string | null;
  setSelectedUpperBody: (path: string | null) => void;
  selectedHair: string | null;
  setSelectedHair: (path: string | null) => void;
  onStartGame: () => void;
}

const DressUpOverlay: React.FC<DressUpOverlayProps> = ({
  selectedShoes,
  setSelectedShoes,
  selectedLowerBody,
  setSelectedLowerBody,
  selectedUpperBody,
  setSelectedUpperBody,
  selectedHair,
  setSelectedHair,
  onStartGame,
}) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-black text-center p-4"
      style={{
        backgroundImage: `url('/mini-games/gamdok-runner/room1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center bg-head-main opacity-60 p-3 rounded-xl">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
          김감독 코디 대작전
        </h2>
        <p className="mb-2 text-lg opacity-90">아무리 늦었어도 옷은입어야지</p>
      </div>{" "}
      <DressUpSelection
        selectedShoes={selectedShoes}
        setSelectedShoes={setSelectedShoes}
        selectedLowerBody={selectedLowerBody}
        setSelectedLowerBody={setSelectedLowerBody}
        selectedUpperBody={selectedUpperBody}
        setSelectedUpperBody={setSelectedUpperBody}
        selectedHair={selectedHair}
        setSelectedHair={setSelectedHair}
      />
      <button
        onClick={onStartGame}
        className="bg-head-brown text-white px-10 py-4 text-2xl font-bold hover:opacity-90 transition-transform active:scale-95  rounded-none shadow-lg"
      >
        달리기 시작!
      </button>
    </div>
  );
};

export default DressUpOverlay;
