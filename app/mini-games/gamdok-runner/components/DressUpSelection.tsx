import Image from "next/image";
import React from "react";

interface DressUpSelectionProps {
  selectedShoes: string | null;
  setSelectedShoes: (path: string | null) => void;
  selectedLowerBody: string | null;
  setSelectedLowerBody: (path: string | null) => void;
  selectedUpperBody: string | null;
  setSelectedUpperBody: (path: string | null) => void;
  selectedHair: string | null;
  setSelectedHair: (path: string | null) => void;
}

const availableShoes = ["/mini-games/gamdok-runner/shoes/shoes1.png"];
const availableLowerBody = ["/mini-games/gamdok-runner/lower-body/lowerbody1.png"];
const availableUpperBody = [
  "/mini-games/gamdok-runner/upper-body/upperbody1.png",
  "/mini-games/gamdok-runner/upper-body/upperbody2.png",
  "/mini-games/gamdok-runner/upper-body/upperbody3.png",
  "/mini-games/gamdok-runner/upper-body/upperbody4.png",
];
const availableHair = [
  "/mini-games/gamdok-runner/hair/hair1.png",
  "/mini-games/gamdok-runner/hair/hair2.png",
  "/mini-games/gamdok-runner/hair/hair3.png",
  "/mini-games/gamdok-runner/hair/hair4.png",
  "/mini-games/gamdok-runner/hair/hair5.png",
  "/mini-games/gamdok-runner/hair/hair6.png",
  "/mini-games/gamdok-runner/hair/hair7.png",
  "/mini-games/gamdok-runner/hair/hair8.png",
];

const DressUpSelection: React.FC<DressUpSelectionProps> = ({
  selectedShoes,
  setSelectedShoes,
  selectedLowerBody,
  setSelectedLowerBody,
  selectedUpperBody,
  setSelectedUpperBody,
  selectedHair,
  setSelectedHair,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8 w-full max-w-full max-h-[60vh] overflow-auto px-4">
      <div className="mb-4">
        <div className="flex flex-wrap justify-center gap-2">
          {/* None option for hair */}
          <button
            onClick={() => setSelectedHair(null)}
            className={`p-2 border-2 bg-head-main ${selectedHair === null ? "border-yellow-400" : "border-gray-400"} rounded-md flex items-center justify-center`}
          >
            <span className="text-white text-lg font-bold">X</span>
          </button>
          {availableHair.map((hair) => (
            <button
              key={hair}
              onClick={() => setSelectedHair(hair)}
              className={`p-2 border-2 bg-head-main ${selectedHair === hair ? "border-yellow-400" : "border-gray-400"} rounded-md`}
            >
              <Image
                src={hair}
                alt="hair"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                width={48}
                height={48}
              />{" "}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {/* None option for upper body */}
          <button
            onClick={() => setSelectedUpperBody(null)}
            className={`p-2 border-2 bg-head-main ${selectedUpperBody === null ? "border-yellow-400" : "border-gray-400"} rounded-md flex items-center justify-center`}
          >
            <span className="text-white text-lg font-bold">X</span>
          </button>
          {availableUpperBody.map((ub) => (
            <button
              key={ub}
              onClick={() => setSelectedUpperBody(ub)}
              className={`p-2 border-2 bg-head-main ${selectedUpperBody === ub ? "border-yellow-400" : "border-gray-400"} rounded-md`}
            >
              <Image
                src={ub}
                alt="upper body"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                width={48}
                height={48}
              />{" "}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DressUpSelection;
