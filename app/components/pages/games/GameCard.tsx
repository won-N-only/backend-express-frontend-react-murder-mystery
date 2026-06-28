import type { Game } from "@app/types";

interface GameCardProps {
    game: Game;
    onClick?: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
    const category = game.category ?? null;

    const categoryStyle = (() => {
        switch (category) {
            case "오프라인":
                return {
                    border: "border-amber-400",
                    badge: "bg-amber-50 text-amber-800",
                };
            case "크라임씬":
                return {
                    border: "border-rose-500",
                    badge: "bg-rose-50 text-rose-800",
                };
            case "온라인/미정발":
                return {
                    border: "border-emerald-500",
                    badge: "bg-emerald-50 text-emerald-800",
                };
            case "우즈/리얼월드":
                return {
                    border: "border-violet-400",
                    badge: "bg-violet-50 text-violet-800",
                };
            default:
                return {
                    border: "border-transparent",
                    badge: "bg-head-white/70 text-head-text",
                };
        }
    })();

    return (
        <button
            onClick={onClick}
            className={`section-card block w-full text-left hover:opacity-95 transition-opacity relative border-l-4 ${categoryStyle.border}`}
        >
            <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-head-text font-medium">#{game.orderNumber}</div>
                    {category && (
                        <span
                            className={`shrink-0 inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-none ${categoryStyle.badge}`}
                        >
                            {category}
                        </span>
                    )}
                </div>
                <h2 className="font-bold text-lg leading-tight text-head-text">{game.name}</h2>
                <div className="text-sm text-head-text space-y-1">
                    <div>
                        {game.minPlayers}
                        {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                    </div>
                    {game.company && <div>{game.company}</div>}
                    {game.series && <div>{game.series}</div>}
                </div>
            </div>
        </button>
    );
}
