import type { Game } from "@app/types";

interface GameCardProps {
    game: Game;
    onClick?: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
    return (
        <button
            onClick={onClick}
            className="section-card block w-full text-left hover:opacity-95 transition-opacity"
        >
            <div className="space-y-2.5">
                <div className="text-xs text-head-gray-500 font-medium">#{game.orderNumber}</div>
                <h2 className="font-bold text-lg leading-tight text-head-gray-800">{game.name}</h2>
                <div className="text-sm text-head-gray-500 space-y-1">
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
