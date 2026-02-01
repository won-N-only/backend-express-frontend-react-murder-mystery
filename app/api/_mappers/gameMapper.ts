import type { Game } from "@game/domain/entities/Game";

export interface GameDto {
    _id: string;
    orderNumber: number;
    name: string;
    minPlayers: number;
    maxPlayers: number | null;
    company: string | null;
    series: string | null;
    ownerNote: string | null;
    thumbnail?: string | null;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function toGameDto(game: Game): GameDto {
    return {
        _id: game.id?.toString() ?? "",
        orderNumber: game.orderNumber,
        name: game.name,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        company: game.company,
        series: game.series,
        ownerNote: game.ownerNote,
        thumbnail: game.thumbnail,
        description: game.description,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
    };
}
