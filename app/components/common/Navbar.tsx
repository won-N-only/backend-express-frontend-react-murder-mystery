"use client";

import { SCROLL_POSITION_KEY } from "@app/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HEADER_BG = "#f1f0ec";
const HEADER_BORDER = "#000000";

export default function Navbar() {
    const pathname = usePathname();
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

    return (
        <div className="sticky top-0 z-40 w-full bg-[#f1f0ec]">
            <nav
                className="flex items-center justify-center w-full"
                style={{
                    height: "100px",
                    backgroundColor: HEADER_BG,
                }}
            >
                <div className="mx-auto max-w-[720px] w-full   flex items-center justify-between">
                    {/* 왼쪽: 얼굴 + 머리 겹친 아이콘 (호버 시 머리 회전·날아감) */}
                    <Link
                        href="/"
                        className="group/icon relative flex-shrink-0 block w-16 h-16 rounded-full overflow-hidden"
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

                    {/* 오른쪽: 메뉴 5개 */}
                    <div className="flex items-center gap-16 md:gap-18">
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href === "/history" && pathname === "/history") ||
                                (item.href !== "/" &&
                                    item.href !== "/history" &&
                                    pathname?.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={item.href === "/games" ? handleGamesClick : undefined}
                                    className={`text-m font-medium transition-colors ${
                                        isActive
                                            ? "text-[#1f2937]"
                                            : "text-[#333] hover:text-[#1f2937]"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
            {/* 헤더 아래 구분선 (sticky에 포함되어 스크롤 시 같이 붙음) */}
            <div
                className="w-full border-b-2 border-solid"
                style={{ borderColor: HEADER_BORDER }}
                aria-hidden
            />
        </div>
    );
}
