"use client";

import { SCROLL_POSITION_KEY } from "@app/lib/constants";
import { LINK_CLASS_INACTIVE, NAV_ITEMS } from "@app/lib/navConstants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * pathname 없이 렌더하는 네비게이션.
 * Router 컨텍스트가 없을 때(에러 바운더리 등) 사용.
 * 링크·메뉴는 정상 동작하고, 현재 페이지 강조(밑줄)만 없음.
 */
export default function NavbarFallback() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleGamesClick = () => sessionStorage.removeItem(SCROLL_POSITION_KEY);

    return (
        <div className="fixed top-0 left-0 right-0 z-40 w-full bg-head-main">
            <nav className="flex items-center justify-center w-full h-[100px] bg-head-main">
                <div className="mx-auto max-w-content w-full px-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group/icon relative flex-shrink-0 block w-16 h-16 rounded-full overflow-visible"
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
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            aria-hidden
                        />
                    </Link>
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={item.href === "/games" ? handleGamesClick : undefined}
                                className={LINK_CLASS_INACTIVE}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="md:hidden rounded-lg text-[#333] hover:bg-black/5 btn-standard-padding"
                        onClick={() => setMobileMenuOpen((p) => !p)}
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        <span className="block w-6 h-0.5 bg-current rounded" />
                        <span className="block w-6 h-0.5 bg-current rounded mt-1.5" />
                        <span className="block w-6 h-0.5 bg-current rounded mt-1.5" />
                    </button>
                </div>
            </nav>
            <button
                type="button"
                className={`md:hidden fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden={!mobileMenuOpen}
                tabIndex={-1}
            />
            <div
                className={`md:hidden fixed top-0 right-0 z-50 h-full w-64 max-w-[85vw] bg-head-main shadow-xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <nav
                    className="flex flex-col items-end gap-5 pt-24 px-4 font-bold"
                    aria-label="메인 메뉴"
                >
                    <div className="text-3xl font-bold">메뉴</div>
                    <div
                        className="w-full border-b-2 border-head-border border-solid text-2xl"
                        aria-hidden
                    />
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (item.href === "/games") handleGamesClick();
                            }}
                            className={LINK_CLASS_INACTIVE}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="w-full border-b-2 border-head-border border-solid" aria-hidden />
        </div>
    );
}
