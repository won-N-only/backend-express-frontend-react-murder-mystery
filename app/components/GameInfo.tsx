import type { Game } from "../types";

interface GameInfoProps {
    game: Game;
}

export default function GameInfo({ game }: GameInfoProps) {
    return (
        <div className="space-y-1">
            <div className="text-sm text-slate-500">#{game.orderNumber}</div>
            <h1 className="text-2xl font-bold">{game.name}</h1>
            <div className="text-xs text-slate-500">
                {game.minPlayers}
                {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                {game.company && ` · ${game.company}`}
                {game.series && ` · ${game.series}`}
            </div>
        </div>
    );
}
