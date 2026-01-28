import { useEffect, useRef } from "react";
import { SCROLL_POSITION_KEY } from "../lib/constants";

export function useScrollRestore(dependencies: any[] = []) {
    const hasRestoredRef = useRef(false);
    const isRestoringRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined" || hasRestoredRef.current) return;
        if (dependencies.some((dep) => !dep || (Array.isArray(dep) && dep.length === 0))) return;

        const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (savedPosition) {
            isRestoringRef.current = true;
            hasRestoredRef.current = true;
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition, 10));
                isRestoringRef.current = false;
            }, 100);
        }
    }, dependencies);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = () => {
            if (isRestoringRef.current) return;
            sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
        };

        let timeoutId: NodeJS.Timeout;
        const debouncedHandleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 100);
        };

        window.addEventListener("scroll", debouncedHandleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", debouncedHandleScroll);
            clearTimeout(timeoutId);
        };
    }, []);
}
