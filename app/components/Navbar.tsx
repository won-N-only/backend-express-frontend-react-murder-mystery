"use client";

import { SCROLL_POSITION_KEY } from "../lib/constants";

export default function Navbar() {
    const handleGamesClick = () => {
        // 게임 목록 링크 클릭 시 스크롤 위치 초기화
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
    };

    return (
        <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
            <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
                <a href="/" className="font-bold text-lg">
                    대머리 매칭
                </a>
                <div className="flex gap-4 text-sm">
                    <a href="/" className="hover:text-blue-600">
                        홈
                    </a>
                    <a href="/games" onClick={handleGamesClick} className="hover:text-blue-600">
                        게임 목록
                    </a>
                    <a href="/match" className="hover:text-blue-600">
                        매칭
                    </a>
                    <a href="/stats" className="hover:text-blue-600">
                        통계
                    </a>
                </div>
            </div>
        </nav>
    );
}
