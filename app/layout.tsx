import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "머더 미스터리 매칭",
    description: "머더 미스터리/파티 게임 매칭 및 통계",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-900">
                <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
                    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                🎮
                            </span>
                            <span>머더 미스터리 매칭</span>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <a href="/" className="px-3 py-1 rounded-lg hover:bg-slate-100">
                                홈
                            </a>
                            <a href="/games" className="px-3 py-1 rounded-lg hover:bg-slate-100">
                                게임 목록
                            </a>
                            <a href="/match" className="px-3 py-1 rounded-lg hover:bg-slate-100">
                                매칭
                            </a>
                            <a href="/stats" className="px-3 py-1 rounded-lg hover:bg-slate-100">
                                통계
                            </a>
                        </div>
                    </div>
                </nav>
                <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            </body>
        </html>
    );
}

