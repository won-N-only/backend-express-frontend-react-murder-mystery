"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Image
            className={`fixed bottom-6 right-6 z-30 w-14 h-14 overflow-hidden transition-all duration-300 ease-out cursor-pointer ${
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto hover:scale-105 active:scale-95"
                    : "opacity-0 translate-y-4 pointer-events-none"
            }`}
            aria-label="맨 위로"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            src="/top_head.png"
            alt="맨 위로"
            width={420}
            height={420}
        />
    );
}
