import type { Game } from "@app/types";

interface GameCardProps {
    game: Game;
    onClick?: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
    return (
        <button
            onClick={onClick}
            className="block w-full text-left rounded-xl bg-head-white shadow-soft hover:shadow-md transition-all hover:scale-[1.02] p-5"
        >
            <div className="space-y-2">
                <div className="text-xs text-head-gray-500 font-medium">#{game.orderNumber}</div>
                <h2 className="font-semibold text-lg leading-tight text-head-gray-800">
                    {game.name}
                </h2>
                <div className="text-xs text-head-gray-500 space-y-1">
                    <div>
                        {game.minPlayers}
                        {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                    </div>
                    {game.company && <div className="text-head-gray-500">{game.company}</div>}
                    {game.series && <div className="text-head-gray-500">{game.series}</div>}
                </div>
            </div>
        </button>
    );
}
