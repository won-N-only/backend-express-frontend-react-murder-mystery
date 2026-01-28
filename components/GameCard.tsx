import { Game } from "@/types";
import Link from "next/link";

interface GameCardProps {
    game: Game;
    showDetails?: boolean;
}

export default function GameCard({ game, showDetails = false }: GameCardProps) {
    return (
        <div className="glass-effect p-5 rounded-xl border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <Link
                        href={`/games/${game.id}`}
                        className="block group-hover:text-blue-600 transition-colors"
                    >
                        <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {game.min_players}
                            {game.max_players ? `-${game.max_players}` : "+"}인
                        </span>
                        {game.company && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {game.company}
                            </span>
                        )}
                        {game.series && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                {game.series}
                            </span>
                        )}
                    </div>
                    {showDetails && game.director && (
                        <p className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">감독:</span> {game.director}
                        </p>
                    )}
                </div>
                <Link
                    href={`/games/${game.id}`}
                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                >
                    →
                </Link>
            </div>
        </div>
    );
}
