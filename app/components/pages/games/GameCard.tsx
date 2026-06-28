import { getCategoryStyle } from "@app/lib/categoryStyles";
import type { Game } from "@app/types";

interface GameCardProps {
    game: Game;
    onClick?: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
    const category = game.category ?? null;
    const categoryStyle = getCategoryStyle(category);

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
