"use client";

import { useState } from "react";
import FloatingTextComponent from "./components/FloatingText";
import GameContainer from "./components/GameContainer";
import GameControls from "./components/GameControls";
import GameHeader from "./components/GameHeader";
import GameImage from "./components/GameImage";
import ItemInfo from "./components/ItemInfo";
import ResultModal from "./components/ResultModal";
import { LEVELS } from "./constants";
import { FloatingText, LevelData } from "./types";

export default function GrowBaldGame() {
    const [money, setMoney] = useState(5000); // 초기 자금 1000원
    const [level, setLevel] = useState(0);
    const [modalMsg, setModalMsg] = useState<string | null>(null);
    const [pulse, setPulse] = useState(false);
    const [spin, setSpin] = useState(false);
    const [enhanceResult, setEnhanceResult] = useState<"success" | "maintain" | "fail" | null>(
        null,
    );
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const [isClickCooldown, setIsClickCooldown] = useState(false); // New state for click cooldown

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

    // 대머리 클릭 시 pulse + click_gold 획득
    const handleHeadClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (isClickCooldown) {
            return; // If in cooldown, ignore click
        }
        setIsClickCooldown(true); // Start cooldown

        // 1. 돈 증가 (10% ~ 20% 범위에서 랜덤)
        const minGold = currentLevel.click_gold * 0.8;
        const maxGold = currentLevel.click_gold * 1.2;
        let randomGold = Math.floor(Math.random() * (maxGold - minGold + 1) + minGold);

        // 1.1 1%확률로 잭팟
        if (Math.random() < 0.01) {
            randomGold = Number(randomGold) * 70;
        }

        setMoney((prev) => prev + randomGold);

        // 2. 애니메이션 효과
        setPulse(true);
        setTimeout(() => setPulse(false), 150);

        // 3. 플로팅 텍스트 추가 (클릭한 위치 근처에)
        const newText: FloatingText = {
            id: Date.now() + Math.random(), // 고유 ID 보장
            text: `+${randomGold.toLocaleString()}`,
            x: e.clientX,
            y: e.clientY,
        };

        setFloatingTexts((prev) => [...prev, newText]);

        // 4. 1200ms 뒤 텍스트 삭제
        setTimeout(() => {
            setFloatingTexts((prev) => prev.filter((ft) => ft.id !== newText.id));
        }, 1200);

        // Reset cooldown after 250ms
        setTimeout(() => {
            setIsClickCooldown(false);
        }, 150);
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
            {/* 대머리 이미지 */}
            <div className="relative">
                <GameImage
                    level={level}
                    currentLevel={currentLevel}
                    pulse={pulse}
                    spin={spin}
                    handleHeadClick={handleHeadClick}
                />
            </div>
            {/* 대머리 현재 정보 */}
            <ItemInfo level={level} currentLevel={currentLevel} />
            {/* 강화 및 판매 버튼 */}
            <GameControls
                currentMoney={money}
                currentLevel={currentLevel}
                handleEnhance={handleEnhance}
                handleSell={handleSell}
            />
            {/* 결과 모달 */}
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
            {/* 클릭 플로팅 텍스트 */}
            {floatingTexts.map((ft) => (
                <FloatingTextComponent key={ft.id} id={ft.id} text={ft.text} x={ft.x} y={ft.y} />
            ))}
        </GameContainer>
    );
}
