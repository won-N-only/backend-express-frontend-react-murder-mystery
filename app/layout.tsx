import Navbar from "@app/components/common/Navbar";
import ScrollToTop from "@app/components/common/ScrollToTop";
import { SelectedPlayerProvider } from "@app/providers/SelectedPlayerProvider";
import { SWRProvider } from "@app/providers/SWRProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "대머리",
    description: "대구 머더 미스터리 모임",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    icons: {
        icon: "/favicon_face.png",
    },
    openGraph: {
        title: "대머리",
        description: "대구 머더 미스터리 모임",
        images: [
            {
                url: "/thumbnail.png",
                width: 1200,
                height: 630,
                alt: "대머리 - 대구 머더 미스터리",
            },
        ],
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "대머리",
        description: "대구 머더 미스터리 모임",
        images: ["/thumbnail.png"],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="min-h-screen bg-head-main text-head-text">
                <SWRProvider>
                    <SelectedPlayerProvider>
                        <Navbar />
                        <main className="mx-auto max-w-content w-full px-4 pt-[100px] section-bottom bg-transparent">
                            {children}
                        </main>
                        <ScrollToTop />
                        <SpeedInsights />
                    </SelectedPlayerProvider>
                </SWRProvider>
            </body>
        </html>
    );
}
