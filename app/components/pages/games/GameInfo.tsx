import type { Game } from "@app/types";
import Image from "next/image";

interface GameInfoProps {
    game: Game;
}

export default function GameInfo({ game }: GameInfoProps) {
    const hasThumbnail = game.thumbnail && game.thumbnail.trim().length > 0;
    const hasDescription = game.description && game.description.trim().length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {hasThumbnail && (
                    <div className="shrink-0 w-full sm:w-48 aspect-[3/4] relative rounded-xl overflow-hidden bg-head-gray-200">
                        <Image
                            src={game.thumbnail!}
                            alt={game.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 12rem"
                            unoptimized={game.thumbnail!.startsWith("http")}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-sm text-head-text">#{game.orderNumber}</div>
                    <h1 className="text-2xl font-bold text-head-text">{game.name}</h1>
                    <div className="text-xs text-head-text">
                        {game.minPlayers}
                        {game.maxPlayers ? `-${game.maxPlayers}` : "+"}인
                        {game.company && ` · ${game.company}`}
                        {game.series && ` · ${game.series}`}
                    </div>
                </div>
            </div>
            {hasDescription && (
                <section className="rounded-xl bg-head-gray-100 p-4">
                    <h2 className="text-sm font-semibold text-head-text">시놉시스</h2>
                    <p className="text-sm text-head-text whitespace-pre-wrap leading-relaxed mt-2">
                        {game.description}
                    </p>
                </section>
            )}
        </div>
    );
}
