"use client";

import { useState } from "react";
import GameContainer from "./components/GameContainer";
import GameControls from "./components/GameControls";
import GameHeader from "./components/GameHeader";
import GameImage from "./components/GameImage";
import ItemInfo from "./components/ItemInfo";
import ResultModal from "./components/ResultModal";
import { LEVELS } from "./constants";
import { LevelData } from "./types";

export default function GrowBaldGame() {
    const [money, setMoney] = useState(100_000);
    const [level, setLevel] = useState(0);
    const [modalMsg, setModalMsg] = useState<string | null>(null);
    const [pulse, setPulse] = useState(false);
    const [spin, setSpin] = useState(false);
    const [enhanceResult, setEnhanceResult] = useState<"success" | "maintain" | "fail" | null>(
        null,
    );

    const currentLevel = LEVELS[level];
    const MAX_LEVEL = LEVELS.length - 1;

    // 강화 버튼
    const handleEnhance = () => {
        if (money < currentLevel.cost) {
            setModalMsg("돈이 부족합니다.");
            setEnhanceResult(null);
            return;
        }
        setMoney((prev) => prev - currentLevel.cost);

        const rand = Math.random();
        if (rand < currentLevel.success_rate) {
            if (level < LEVELS.length - 1) setLevel((prev) => prev + 1);
            setModalMsg(currentLevel.success_msg);
            setEnhanceResult("success");
        } else if (rand < currentLevel.success_rate + currentLevel.maintain_rate) {
            setModalMsg(currentLevel.maintain_msg ?? "강화 유지");
            setEnhanceResult("maintain");
        } else {
            setModalMsg(currentLevel.fail_msg ?? "강화 실패");
            setLevel(0);
            setEnhanceResult("fail");
        }
    };

    // 판매 버튼
    const handleSell = () => {
        setMoney((prev) => prev + currentLevel.price);
        setLevel(0); // 단계 초기화
    };

    // 대머리 클릭 시 pulse
    const handleHeadClick = () => {
        setPulse(true);
        setTimeout(() => setPulse(false), 2500);
    };

    // 프로그레스 바 텍스트 생성기
    const getProgressText = (
        enhanceResult: "success" | "maintain" | "fail" | null,
        level: number,
        currentLevel: LevelData,
    ) => {
        if (enhanceResult === "success") {
            // 성공 시: +이전 -> +현재 아이템명
            return `+${level - 1} → +${level} ${currentLevel.item_name}`;
        }
        if (enhanceResult === "maintain") {
            // 유지 시: +현재 -> +현재 아이템명
            return `+${level} → +${level} ${currentLevel.item_name}`;
        }
        // 실패 시: +현재(0) 아이템명
        return `+${level} ${currentLevel.item_name}`;
    };

    const handleModalClose = (result: "success" | "maintain" | "fail" | null) => {
        setModalMsg(null);
        if (result === "success") {
            setSpin(true);
            setTimeout(() => setSpin(false), 1800);
        }
    };

    return (
        <GameContainer>
            <GameHeader money={money} />
            <GameImage
                level={level}
                currentLevel={currentLevel}
                pulse={pulse}
                spin={spin}
                handleHeadClick={handleHeadClick}
            />
            <ItemInfo level={level} currentLevel={currentLevel} />
            <GameControls
                currentLevel={currentLevel}
                handleEnhance={handleEnhance}
                handleSell={handleSell}
            />
            {modalMsg && (
                <ResultModal
                    modalMsg={modalMsg}
                    enhanceResult={enhanceResult}
                    level={level}
                    currentLevel={currentLevel}
                    MAX_LEVEL={MAX_LEVEL}
                    getProgressText={(result, level, currentLevel) =>
                        getProgressText(result, level, currentLevel)
                    }
                    onClose={handleModalClose}
                />
            )}
        </GameContainer>
    );
}
