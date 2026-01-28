import type { Player } from "../types";

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
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white hover:bg-slate-50"
                    }`}
                >
                    {p.name}
                </button>
            ))}
        </div>
    );
}
