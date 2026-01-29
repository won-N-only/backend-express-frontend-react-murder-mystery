import type { Player } from "@app/types";

interface PlayerSelectorProps {
    players: Player[];
    selectedPlayers: string[];
    onToggle: (id: string) => void;
}

export default function PlayerSelector({
    players,
    selectedPlayers,
    onToggle,
}: PlayerSelectorProps) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {players.map((p) => (
                <button
                    key={p._id}
                    type="button"
                    onClick={() => onToggle(p._id)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                        selectedPlayers.includes(p._id)
                            ? "bg-head-blue text-head-white border-head-blue shadow-soft"
                            : "bg-head-white hover:bg-head-gray-100 border-head-gray-300 text-head-gray-800"
                    }`}
                >
                    {p.name}
                </button>
            ))}
        </div>
    );
}
