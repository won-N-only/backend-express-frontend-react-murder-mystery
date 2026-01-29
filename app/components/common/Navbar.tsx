"use client";

import { SCROLL_POSITION_KEY } from "@app/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const HEADER_BG = "#f1f0ec";
const HEADER_BORDER = "#000000";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleGamesClick = () => {
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
    };

    const navItems = [
        { href: "/", label: "대머리" },
        { href: "/history", label: "이력" },
        { href: "/games", label: "찾기" },
        { href: "/match", label: "매칭" },
        { href: "/stats", label: "통계" },
    ];

    const isActive = (item: (typeof navItems)[0]) =>
        pathname === item.href ||
        (item.href === "/history" && pathname === "/history") ||
        (item.href !== "/" && item.href !== "/history" && pathname?.startsWith(item.href));

    const linkClassName = (item: (typeof navItems)[0]) =>
        `block py-2 text-m font-medium transition-colors ${
            isActive(item)
                ? "border-b-2 border-black text-[#1f2937]"
                : "text-[#333] hover:text-[#1f2937]"
        }`;

    return (
        <div className="sticky top-0 z-40 w-full bg-[#f1f0ec]">
            <nav
                className="flex items-center justify-center w-full"
                style={{ height: "100px", backgroundColor: HEADER_BG }}
            >
                <div className="mx-auto max-w-[720px] w-full px-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group/icon relative flex-shrink-0 block w-16 h-16 rounded-full overflow-hidden transition-transform duration-500 ease-out hover:rotate-[7deg]"
                        aria-label="홈으로"
                    >
                        <Image
                            src="/favicon_face.png"
                            alt=""
                            width={80}
                            height={80}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            aria-hidden
                        />
                        <Image
                            src="/favicon_hair.png"
                            alt=""
                            width={80}
                            height={80}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover/icon:translate-y-[-120%] group-hover/icon:rotate-[360deg] group-hover/icon:opacity-0"
                            aria-hidden
                        />
                    </Link>

                    {/* 데스크톱: 가로 메뉴 */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={item.href === "/games" ? handleGamesClick : undefined}
                                className={linkClassName(item)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* 모바일: 햄버거 버튼 */}
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-lg text-[#333] hover:bg-black/5"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        <span className="block w-6 h-0.5 bg-current rounded mb-1.5" />
                        <span className="block w-6 h-0.5 bg-current rounded mb-1.5" />
                        <span className="block w-6 h-0.5 bg-current rounded" />
                    </button>
                </div>
            </nav>

            {/* 모바일: 오른쪽 슬라이드 메뉴 */}
            {/* 배경 딤드 (클릭 시 닫힘) */}
            <button
                type="button"
                className={`md:hidden fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ease-out ${
                    mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden
            />
            {/* 슬라이드 패널 */}
            <div
                className={`md:hidden fixed top-0 right-0 z-50 h-full w-64 max-w-[85vw] bg-[#f1f0ec] shadow-xl transition-transform duration-300 ease-out ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <nav
                    className="flex flex-col items-end gap-5 pt-24 px-4 font-bold "
                    aria-label="메인 메뉴"
                >
                    <div className="text-3xl font-bold">메뉴</div>
                    <div
                        className="w-full border-b-2 border-solid text-2xl"
                        style={{ borderColor: HEADER_BORDER }}
                        aria-hidden
                    />{" "}
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (item.href === "/games") handleGamesClick();
                            }}
                            className={`${linkClassName(item)}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* 헤더 아래 구분선 */}
            <div
                className="w-full border-b-2 border-solid"
                style={{ borderColor: HEADER_BORDER }}
                aria-hidden
            />
        </div>
    );
}
