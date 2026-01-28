"use client";

import { Player } from "@/types";

interface PlayerSelectorProps {
    players: Player[];
    selectedIds: number[];
    onToggle: (playerId: number) => void;
}

export default function PlayerSelector({ players, selectedIds, onToggle }: PlayerSelectorProps) {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {players.map((player) => (
                <label
                    key={player.id}
                    className={`relative p-4 rounded-xl cursor-pointer text-center font-medium transition-all duration-200 transform ${
                        selectedIds.includes(player.id)
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                            : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                    }`}
                >
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(player.id)}
                        onChange={() => onToggle(player.id)}
                        className="hidden"
                    />
                    {player.name}
                    {selectedIds.includes(player.id) && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                            <span className="text-blue-500 text-xs font-bold">✓</span>
                        </span>
                    )}
                </label>
            ))}
        </div>
    );
}
