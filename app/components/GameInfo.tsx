import type { Game } from "../types";

interface GameInfoProps {
    game: Game;
}

export default function GameInfo({ game }: GameInfoProps) {
    return (
        <div className="space-y-1">
            <div className="text-sm text-head-gray-500">#{game.orderNumber}</div>
            <h1 className="text-2xl font-bold text-head-gray-800">{game.name}</h1>
            <div className="text-xs text-head-gray-500">
                {game.minPlayers}
                {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                {game.company && ` · ${game.company}`}
                {game.series && ` · ${game.series}`}
            </div>
        </div>
    );
}
