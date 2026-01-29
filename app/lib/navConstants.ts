/** 네비게이션 메뉴 항목 (Navbar / NavbarFallback 공용) */
export const NAV_ITEMS = [
    { href: "/", label: "대머리" },
    { href: "/history", label: "전과 기록" },
    { href: "/games", label: "사건 수색" },
    { href: "/match", label: "매칭" },
    { href: "/stats", label: "통계" },
] as const;

export const LINK_CLASS_INACTIVE =
    "block py-2 text-m font-medium transition-colors text-[#333] hover:text-[#1f2937]";
export const LINK_CLASS_ACTIVE =
    "block py-2 text-m font-medium transition-colors border-b-2 border-black text-[#1f2937]";
