/** 네비게이션 메뉴 항목 (Navbar / NavbarFallback 공용) */
export const NAV_ITEMS = [
    { href: "/", label: "대머리" },
    { href: "/history", label: "게임 기록" },
    { href: "/games", label: "게임 목록" },
    { href: "/match", label: "조합 추천" },
    { href: "/stats", label: "성적 확인" },
    { href: "/faq", label: "궁금해요" },
] as const;

/** 밑줄 공간을 항상 확보해 활성 전환 시 글씨 위치가 안 움직이도록 border-b-2 공통, 밑줄은 텍스트에 가깝게 pt(::after)로 간격 */
const LINK_BASE =
    "block pt-2 text-sm lg:text-base border-b-2 transition-colors text-head-text nav-link-spacer";
export const LINK_CLASS_INACTIVE =
    LINK_BASE + " font-semibold border-transparent hover:text-head-brown";
export const LINK_CLASS_ACTIVE =
    LINK_BASE + " font-extrabold border-head-border";
