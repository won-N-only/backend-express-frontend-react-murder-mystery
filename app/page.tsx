"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function LandingPage() {
    const router = useRouter();
    const [hairStartPos, setHairStartPos] = useState({ x: 0, y: 0, angle: 0 });

    useEffect(() => {
        // 랜덤한 각도 (0-360도)
        const angle = Math.random() * 360;
        // 랜덤한 거리 (300-500px)
        const distance = 300 + Math.random() * 200;
        // 각도에 따른 x, y 좌표 계산
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        setHairStartPos({ x, y, angle });
    }, []);

    const handleFaceClick = useCallback(() => {
        router.push("/brick-breaker");
    }, [router]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center px-4 pt-[100px] pb-[100px]">
                <div className="relative w-full max-w-md aspect-[4/3]">
                    <div className="relative w-full h-full">
                        <Image
                            src="/detective_office.png"
                            alt="탐정 사무실"
                            className="object-contain"
                            width={544}
                            height={420}
                            priority
                        />
                        {/* 얼굴 - hover 시 머리 날아옴 */}
                        <div
                            className="group/face absolute top-[15%] left-[52.4%] w-[52px] h-[52px] -translate-x-1/2 cursor-pointer"
                            onClick={handleFaceClick}
                        >
                            <Image
                                src="/detective_office_head.png"
                                alt=""
                                width={52}
                                height={52}
                                className="w-full h-full object-cover object-center"
                                aria-hidden
                            />
                            {/* 헤어 - hover 시 랜덤한 곳에서 빠르게 날아옴 */}
                            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                <div
                                    className="hair-fly-in absolute top-0 left-1/2 w-[48px] h-[34px] transition-all duration-550 ease-out opacity-0 group-hover/face:opacity-100"
                                    style={
                                        {
                                            "--hair-x": `${hairStartPos.x}px`,
                                            "--hair-y": `${hairStartPos.y}px`,
                                            "--hair-rotate": `${hairStartPos.angle + 360}deg`,
                                            transform: `translate(calc(-50% + var(--hair-x)), var(--hair-y)) rotate(var(--hair-rotate))`,
                                        } as React.CSSProperties & {
                                            "--hair-x"?: string;
                                            "--hair-y"?: string;
                                            "--hair-rotate"?: string;
                                        }
                                    }
                                >
                                    <Image
                                        src="/detective_office_hair.png"
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="w-full h-full object-cover object-center"
                                        aria-hidden
                                    />
                                </div>
                            </div>
                        </div>
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

                <div className="pt-section flex justify-center">
                    <Image
                        src="/makers.png"
                        alt="makers"
                        width={70}
                        height={50}
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
