import type { Player } from "@player/domain/entities/Player";

export interface PlayerDto {
    _id: string;
    name: string;
    lastUpdated: Date | null;
    createdAt: Date;
}

export function toPlayerDto(player: Player): PlayerDto {
    return {
        _id: player.id?.toString() ?? "",
        name: player.name,
        lastUpdated: player.lastUpdated,
        createdAt: player.createdAt,
    };
}
