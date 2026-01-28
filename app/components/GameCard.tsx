import type { Game } from "../types";

interface GameCardProps {
    game: Game;
}

export default function GameCard({ game }: GameCardProps) {
    return (
        <a
            href={`/games/${game._id}`}
            className="block rounded-xl bg-white/80 shadow hover:shadow-lg transition-all hover:scale-[1.02] p-5"
        >
            <div className="space-y-2">
                <div className="text-xs text-slate-500 font-medium">#{game.orderNumber}</div>
                <h2 className="font-semibold text-lg leading-tight">{game.name}</h2>
                <div className="text-xs text-slate-500 space-y-1">
                    <div>
                        {game.minPlayers}
                        {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                    </div>
                    {game.company && <div className="text-slate-400">{game.company}</div>}
                    {game.series && <div className="text-slate-400">{game.series}</div>}
                </div>
            </div>
        </a>
    );
}
