"use client";

import { Component, type ReactNode } from "react";
import NavbarFallback from "./NavbarFallback";

/**
 * Navbar 내부에서 usePathname 등으로 에러가 나면(예: Router 컨텍스트 없음)
 * 대신 NavbarFallback을 렌더해 페이지가 500 되지 않도록 함.
 */
export default class NavbarErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError = () => ({ hasError: true });

    render() {
        if (this.state.hasError) return <NavbarFallback />;
        return this.props.children;
    }
}
