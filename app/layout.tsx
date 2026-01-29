import Navbar from "@app/components/common/Navbar";
import ScrollToTop from "@app/components/common/ScrollToTop";
import { SelectedPlayerProvider } from "@app/providers/SelectedPlayerProvider";
import { SWRProvider } from "@app/providers/SWRProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "대머리",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="min-h-screen bg-head-main text-slate-900">
                <SWRProvider>
                    <SelectedPlayerProvider>
                        <Navbar />
                        <main className="mx-auto max-w-[720px] px-4 pt-[100px] pb-8 bg-transparent">
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
