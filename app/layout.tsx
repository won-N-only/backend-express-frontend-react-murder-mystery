import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import "./globals.css";
import { SelectedPlayerProvider } from "./providers/SelectedPlayerProvider";
import { SWRProvider } from "./providers/SWRProvider";

export const metadata: Metadata = {
    title: "대머리",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-900">
                <SWRProvider>
                    <SelectedPlayerProvider>
                        <Navbar />
                        <main className="mx-auto max-w-[720px] px-4 py-8">{children}</main>
                    </SelectedPlayerProvider>
                </SWRProvider>
            </body>
        </html>
    );
}
