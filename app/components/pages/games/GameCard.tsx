"use client";

import { getCategoryStyle } from "@app/lib/categoryStyles";
import type { Game } from "@app/types";
import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_THUMBNAIL = "/sad_head.png";

interface GameCardProps {
    game: Game;
    onClick?: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
    const category = game.category ?? null;
    const categoryStyle = getCategoryStyle(category);
    const initialThumbnail = game.thumbnail?.trim() ? game.thumbnail : DEFAULT_THUMBNAIL;
    const [thumbnailSrc, setThumbnailSrc] = useState(initialThumbnail);

    useEffect(() => {
        setThumbnailSrc(game.thumbnail?.trim() ? game.thumbnail : DEFAULT_THUMBNAIL);
    }, [game._id, game.thumbnail]);

    const handleThumbnailError = () => {
        setThumbnailSrc((current) => (current === DEFAULT_THUMBNAIL ? current : DEFAULT_THUMBNAIL));
    };

    return (
        <button
            onClick={onClick}
            className={`section-card flex w-full items-center gap-3 !pl-3 !pr-[30px] text-left hover:opacity-95 transition-opacity relative border-l-4 ${categoryStyle.border}`}
        >
            <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white">
                <Image
                    src={thumbnailSrc}
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={handleThumbnailError}
                />
            </div>

            <div className="min-w-0 flex-1 space-y-2.5">
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
