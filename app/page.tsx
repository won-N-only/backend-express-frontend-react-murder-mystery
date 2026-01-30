"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const FACE_AREA = {
    x: 45,
    xEnd: 60,
    y: 10,
    yEnd: 35,
    hairPosition: { top: "16%", left: "52.2%" },
    hairSize: 80,
} as const;

function getRelativePosition(
    e: React.MouseEvent<HTMLDivElement>,
    container: HTMLDivElement | null,
) {
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
    };
}

function isInFaceArea(x: number, y: number): boolean {
    return x >= FACE_AREA.x && x <= FACE_AREA.xEnd && y >= FACE_AREA.y && y <= FACE_AREA.yEnd;
}

export default function LandingPage() {
    const [isHovering, setIsHovering] = useState(false);
    const [showMakersBubble, setShowMakersBubble] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const pos = getRelativePosition(e, imageRef.current);
        if (pos) {
            const inFaceArea = isInFaceArea(pos.x, pos.y);
            setIsHovering((prev) => (prev !== inFaceArea ? inFaceArea : prev));
        }
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const pos = getRelativePosition(e, imageRef.current);
            if (pos && isInFaceArea(pos.x, pos.y)) {
                router.push("/brick-breaker");
            }
        },
        [router],
    );

    const handleMouseLeave = useCallback(() => setIsHovering(false), []);

    return (
        <div className="flex flex-col min-h-screen">
            <div
                className={`flex flex-col items-center px-4 pt-[100px] ${showMakersBubble ? "pb-32" : "pb-8"}`}
            >
                <div
                    className={`relative w-full max-w-md aspect-[4/3] ${isHovering ? "cursor-pointer" : "cursor-default"}`}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                >
                    <div ref={imageRef} className="relative w-full h-full">
                        <Image
                            src="/detective_office.png"
                            alt="탐정 사무실"
                            className="object-contain"
                            width={544}
                            height={420}
                            priority
                        />
                        {isHovering && (
                            <div className="absolute top-[16%] left-[52.2%] pointer-events-none animate-hair-fall">
                                <Image
                                    src="/favicon_hair.png"
                                    alt=""
                                    width={42}
                                    height={42}
                                    className="rounded-full"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <p
                    className="pt-section text-center text-5xl text-head-text font-medium"
                    style={{ fontFamily: '"Tom\'s Handwriting", Georgia, cursive' }}
                >
                    Don&apos;t worry, we have hair.
                </p>

                <div className="pt-section text-center text-head-text text-lg font-medium">
                    <p>&quot;머리숱 없는 사람만 가입하나요?&quot;</p>
                    <p>
                        <br />
                        아아- 오해입니다. 오해예요.
                        <br />
                        우리의 대머리는 대구 머더 미스터리의 줄임말일 뿐,
                        <br />
                        당신의 소중한 머리카락은 건드리지 않습니다. (아마도요..?)
                        <br />
                        <br />
                        다만, 사건을 파헤치느라 머리를 좀 많이 써야 할 수는 있습니다.
                        <br />
                        평범한 대구 시민인 당신이 천재 탐정이 되거나, 소름 돋는 살인마가 되는 곳!
                        <br />
                        함께 머리를 맞대고(가발 아님) 추리의 세계로 빠져보시죠!
                    </p>
                </div>

                <div className="pt-section relative flex justify-center">
                    <div className="relative">
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMakersBubble((prev) => !prev);
                            }}
                            className="cursor-pointer hover:opacity-80 transition-opacity relative z-10 inline-block"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setShowMakersBubble((prev) => !prev);
                                }
                            }}
                            aria-label="makers 이미지"
                        >
                            <Image
                                src="/makers.png"
                                alt="makers"
                                width={70}
                                height={50}
                                className="object-contain"
                            />
                        </div>
                        {showMakersBubble && (
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100] pointer-events-auto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <div className="relative bg-white rounded-full px-5 py-3 shadow-lg border border-gray-200 min-w-[140px]">
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0">
                                        <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
                                    </div>
                                    <p className="text-black text-sm font-medium text-center leading-relaxed">
                                        <strong>내장지방</strong> <strong>은땅물</strong>
                                        <br />이 만들었어요
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
