import Image from "next/image";
import React from "react";
import { LevelData } from "../types";

interface ResultModalProps {
    modalMsg: string;
    enhanceResult: "success" | "maintain" | "fail" | null;
    level: number;
    currentLevel: LevelData;
    MAX_LEVEL: number;
    getProgressText: (
        enhanceResult: "success" | "maintain" | "fail" | null,
        level: number,
        currentLevel: LevelData,
    ) => string;
    onClose: (enhanceResult: "success" | "maintain" | "fail" | null) => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
    modalMsg,
    enhanceResult,
    level,
    currentLevel,
    MAX_LEVEL,
    getProgressText,
    onClose,
}) => {
    const modalTitleMap = {
        success: "강화 성공!",
        maintain: "강화 유지!",
        fail: "강화 실패!",
    };

    const modalImageMap = {
        success: "/mini-games/grow-bald/success.png",
        maintain: "/mini-games/grow-bald/maintain.png",
        fail: "/mini-games/grow-bald/fail.png",
    };

    const progressPercent = Math.min((level / MAX_LEVEL) * 100, 100);

    return (
        <div
            className="fixed inset-0 flex items-center pt-24 justify-center z-50"
            onClick={() => onClose(enhanceResult)}
        >
            <div
                className="rounded-3xl w-[412.5px] max-w-full max-h-full bg-head-white flex flex-col items-center mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={
                        enhanceResult
                            ? modalImageMap[enhanceResult]
                            : "/mini-games/grow-bald/success.png"
                    }
                    alt={enhanceResult ? modalTitleMap[enhanceResult] : "Success"}
                    width={412}
                    height={220}
                    draggable={false}
                    className="w-full h-auto object-contain rounded-t-3xl"
                />
                <div className="flex flex-col p-6 gap-4 w-full rounded-2xl opacity-90">
                    <h2 className="text-3xl font-bold text-head-text ">
                        {enhanceResult ? modalTitleMap[enhanceResult] : "강화 성공!"}
                    </h2>

                    <div className="relative w-full bg-gray-300 rounded-full h-8 overflow-hidden">
                        <div
                            className="bg-[#EDA234] h-full rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-end px-4 text-white font-bold text-sm md:text-base drop-shadow-md">
                            {getProgressText(enhanceResult, level, currentLevel)}
                        </div>
                    </div>

                    <p className="text-gray-500 text-lg font-medium">{modalMsg}</p>
                    <button
                        onClick={() => onClose(enhanceResult)}
                        className="py-3 w-full bg-head-brown text-white text-xl rounded-xl font-semibold hover:bg-head-brown/90 transition"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
