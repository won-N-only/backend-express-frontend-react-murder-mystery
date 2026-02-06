"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function LandingPage() {
    const router = useRouter();

    const handleFaceClick = useCallback(() => {
        router.push("/mini-games");
    }, [router]);

    return (
        <div className="flex flex-col items-center  ">
            <div className="relative  w-full   aspect-[4/3]">
                <div className="relative w-full h-full flex  justify-center">
                    <Image
                        src="/detective_office.png"
                        alt="탐정 사무실"
                        className="object-contain"
                        width={546}
                        height={420}
                        priority
                    />
                    {/* 얼굴 - hover 시 머리 날아옴 */}
                    <div
                        className="group/face absolute top-[22%] left-[52%] w-[9.6%] -translate-x-1/2 cursor-pointer aspect-square"
                        onClick={handleFaceClick}
                    >
                        <Image
                            src="/detective_office_head.png"
                            alt=""
                            fill
                            sizes="52px"
                            className="object-cover object-center"
                            aria-hidden
                        />
                        {/* 헤어 - hover 시 머리 위에서 돌면서 얹힘 */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <div className="hair-fly-in absolute top-0.4 left-1/2 w-[92%] h-[70%] transition-all duration-700 ease-out opacity-0 group-hover/face:opacity-100">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/detective_office_hair.png"
                                        alt=""
                                        fill
                                        sizes="36px"
                                        className="object-cover object-center"
                                        aria-hidden
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p
                className="pt-section text-center text-3xl md:text-6xl text-head-text font-medium"
                style={{ fontFamily: '"Tom\'s Handwriting", Georgia, cursive' }}
            >
                Don&apos;t worry, we have hair.
            </p>

            <div className="pt-section text-center text-head-text text-sm md:text-base md:text-xl font-medium">
                {" "}
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
    );
}
