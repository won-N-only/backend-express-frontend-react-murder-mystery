import GamesPageContent from "@app/games/GamesPageContent";
import { Suspense } from "react";

export default function GamesPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[50vh] flex items-center justify-center text-head-text">
                    로딩 중...
                </div>
            }
        >
            <GamesPageContent />
        </Suspense>
    );
}
