"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function MiniGamesPage() {
    useEffect(() => {
        // Scroll to the top when the component mounts
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-head-main flex flex-col items-center p-4 lg:p-8">
            <h1 className="text-3xl font-black text-head-text mb-8">대머리 미니게임</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px] justify-center">
                {/* 가발 깨기 카드 */}
                <Link
                    href="/mini-games/brick-breaker"
                    className="bg-head-white  p-6 hover:shadow-2xl transition-transform hover:-translate-y-1 group"
                >
                    <div className="h-40 bg-head-gray-100 mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        가발 깨기
                    </div>
                    <h2 className="text-2xl font-bold text-head-text mb-2">가발 깨기</h2>
                    <p className="text-head-text opacity-80">머리카락을 부셔 가발을 완성하세요!</p>
                </Link>

                {/* 대머리 피하기 카드 */}
                <Link
                    href="/mini-games/avoid-bald"
                    className="bg-head-white  p-6 hover:shadow-2xl transition-transform hover:-translate-y-1 group"
                >
                    <div className="h-40 bg-head-gray-100 mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        대머리 피하기
                    </div>
                    <h2 className="text-2xl font-bold text-head-text mb-2">대머리 피하기</h2>
                    <p className="text-head-text opacity-80">
                        하늘에서 떨어지는 대머리 친구들을 피하세요!
                    </p>
                </Link>

                {/* 김감독 러너 카드 */}
                {/* <Link
                    href="/mini-games/gamdok-runner"
                    className="bg-head-white  p-6 hover:shadow-2xl transition-transform hover:-translate-y-1 group"
                >
                    <div className="h-40 bg-head-gray-100 mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        김감독 러너
                    </div>
                    <h2 className="text-2xl font-bold text-head-text mb-2">
                        김감독 지각 방지 대작전
                    </h2>
                    <p className="text-head-text opacity-80">
                        김감독을 모임까지 지각 없이 보내세요!
                    </p>
                </Link> */}
            </div>
        </div>
    );
}
