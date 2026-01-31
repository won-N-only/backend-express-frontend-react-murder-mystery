"use client";

import Link from "next/link";

export default function MiniGamesPage() {
    return (
        <div className="min-h-screen bg-head-main flex flex-col items-center p-4 lg:p-8">
            <h1 className="text-3xl font-black text-head-text mb-8">대머리 미니게임</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px] justify-center">
                {/* 벽돌 깨기 카드 */}
                <Link
                    href="/brick-breaker"
                    className="bg-head-white  p-6 hover:shadow-2xl transition-transform hover:-translate-y-1 group"
                >
                    <div className="h-40 bg-head-gray-100 mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform"></div>
                    <h2 className="text-2xl font-bold text-head-text mb-2">벽돌 깨기</h2>
                    <p className="text-head-text opacity-80">머리카락을 부셔 가발을 완성하세요!</p>
                </Link>

                {/* 대머리 피하기 카드 */}
                <Link
                    href="/avoid-bald"
                    className="bg-head-white  p-6 hover:shadow-2xl transition-transform hover:-translate-y-1 group"
                >
                    <div className="h-40 bg-head-gray-100 mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform"></div>
                    <h2 className="text-2xl font-bold text-head-text mb-2">대머리 피하기</h2>
                    <p className="text-head-text opacity-80">
                        하늘에서 떨어지는 대머리 친구들을 피하세요!
                    </p>
                </Link>
            </div>
        </div>
    );
}
