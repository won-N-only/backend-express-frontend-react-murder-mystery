"use client";

import { SCROLL_POSITION_KEY } from "@app/lib/constants";
import { LINK_CLASS_ACTIVE, LINK_CLASS_INACTIVE, NAV_ITEMS } from "@app/lib/navConstants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavbarErrorBoundary from "./NavbarErrorBoundary";

/**
 * pathname 기반 현재 페이지 강조(밑줄) 포함.
 * usePathname 실패 시 NavbarErrorBoundary가 NavbarFallback으로 대체.
 */
function NavbarInner() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleGamesClick = () => sessionStorage.removeItem(SCROLL_POSITION_KEY);
    const isActive = (item: (typeof NAV_ITEMS)[number]) =>
        pathname === item.href ||
        (item.href === "/history" && pathname === "/history") ||
        (item.href !== "/" && item.href !== "/history" && pathname?.startsWith(item.href));
    const linkClassName = (item: (typeof NAV_ITEMS)[number]) =>
        isActive(item) ? LINK_CLASS_ACTIVE : LINK_CLASS_INACTIVE;

    return (
        <div className="fixed top-0 left-0 right-0 z-40 w-full bg-head-main">
            <nav className="flex items-center justify-center w-full h-[100px] bg-head-main md:h-[70px]">
                <div className="mx-auto max-w-content w-full px-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group/icon relative flex-shrink-0 block w-16 h-16 rounded-full overflow-visible transition-transform duration-500 ease-out hover:rotate-[7deg]"
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
                            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover/icon:translate-y-[-120%] group-hover/icon:rotate-[360deg]"
                            aria-hidden
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {NAV_ITEMS.map((item) => (
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

                    <button
                        type="button"
                        className="md:hidden rounded-lg font-semibold text-head-text hover:bg-black/5 btn-standard-padding"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        <span className="block w-8 h-0.5 bg-current rounded" />
                        <span className="block w-8 h-0.5 bg-current rounded mt-2" />
                        <span className="block w-8 h-0.5 bg-current rounded mt-2" />
                    </button>
                </div>
            </nav>
            <button
                type="button"
                className={`md:hidden fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ease-out ${
                    mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden={!mobileMenuOpen}
                tabIndex={-1}
            />
            <div
                className={`md:hidden fixed top-0 right-0 z-50 h-full w-64 max-w-[85vw] bg-head-main shadow-xl transition-transform duration-300 ease-out ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <nav
                    className="flex flex-col items-end gap-5 pt-11 px-4 font-bold"
                    aria-label="메인 메뉴"
                >
                    <div className="text-lg md:text-3xl font-bold ">메뉴</div>
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
                            className={linkClassName(item)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <hr className="w-full border-t border-head-border" />
        </div>
    );
}

export default function Navbar() {
    return (
        <NavbarErrorBoundary>
            <NavbarInner />
        </NavbarErrorBoundary>
    );
}
