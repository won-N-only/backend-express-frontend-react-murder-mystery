import type { Combination, Player } from "@app/types";

interface CombinationResultProps {
    combinations: Combination[];
    players: Player[];
}

export default function CombinationResult({ combinations, players }: CombinationResultProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">추천 조합 {combinations.length}개</h2>
            {combinations.map((combo, idx) => (
                <div
                    key={idx}
                    className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-4 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-700">조합 #{idx + 1}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        {combo.groups.map((group, gIdx) => (
                            <div
                                key={gIdx}
                                className="rounded-lg bg-white/90 shadow-sm p-3 border border-blue-100"
                            >
                                <div className="font-semibold text-sm mb-1">{group.game.name}</div>
                                <div className="text-xs text-slate-600 mb-2">
                                    {group.game.minPlayers}
                                    {group.game.maxPlayers ? `-${group.game.maxPlayers}` : "+"}인
                                    {group.game.company && ` · ${group.game.company}`}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {group.playerNames.map((name) => (
                                        <span
                                            key={name}
                                            className={`px-2 py-0.5 rounded text-xs ${
                                                group.allIncomplete
                                                    ? "bg-emerald-100 text-emerald-700 font-medium"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {combo.unusedPlayers.length > 0 && (
                        <div className="text-xs text-slate-500 pt-2 border-t">
                            사용 안 됨:{" "}
                            {combo.unusedPlayers
                                .map((id) => {
                                    const p = players.find((p) => p._id === id);
                                    return p?.name || id;
                                })
                                .join(", ")}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}
