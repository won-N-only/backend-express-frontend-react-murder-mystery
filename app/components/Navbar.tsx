"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCROLL_POSITION_KEY } from "../lib/constants";

export default function Navbar() {
    const pathname = usePathname();
    const handleGamesClick = () => {
        // 게임 목록 링크 클릭 시 스크롤 위치 초기화
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
    };

    const navItems = [
        { href: "/", label: "이력" },
        { href: "/games", label: "찾기" },
        { href: "/match", label: "매칭" },
        { href: "/stats", label: "통계" },
    ];

    return (
        <nav className="sticky top-0 z-40 bg-[#f7f7f7] border-b border-slate-200">
            <div className="mx-auto max-w-[720px] px-4 py-[1.3rem] flex flex-col gap-[0.975rem] w-full">
                <div className="flex items-end gap-3 justify-left">
                    <Link href="/" className="text-5xl font-bold text-head-gray-800">
                        대머리
                    </Link>
                    <span className="text-xs px-2 py-1 rounded-xl bg-[#e5e5e5] text-[#555]">
                        대구 머더 미스터리
                    </span>
                </div>

                <div className="flex bg-[#eee] p-[0.325rem] rounded-full gap-1 w-full">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href === "/" && pathname === "/") ||
                            (item.href !== "/" && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={item.href === "/games" ? handleGamesClick : undefined}
                                className={`flex-1 px-4 py-[0.65rem] rounded-full text-sm transition-colors border-none cursor-pointer text-center ${
                                    isActive
                                        ? "bg-white text-black font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                                        : "bg-transparent text-[#666] hover:text-[#333]"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
