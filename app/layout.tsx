import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "머더 미스터리 게임 매칭",
    description: "파티 게임 매칭 시스템",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="antialiased">
                <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">🎮</span>
                                </div>
                                <h1 className="text-2xl font-bold gradient-text">머더 미스터리</h1>
                            </Link>
                            <div className="flex gap-2">
                                <Link
                                    href="/"
                                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-white/50 transition-colors"
                                >
                                    홈
                                </Link>
                                <Link
                                    href="/games"
                                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-white/50 transition-colors"
                                >
                                    게임 목록
                                </Link>
                                <Link
                                    href="/match"
                                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-white/50 transition-colors"
                                >
                                    게임 매칭
                                </Link>
                                <Link
                                    href="/stats"
                                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-white/50 transition-colors"
                                >
                                    통계
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="container mx-auto px-4 py-8">{children}</main>
            </body>
        </html>
    );
}
