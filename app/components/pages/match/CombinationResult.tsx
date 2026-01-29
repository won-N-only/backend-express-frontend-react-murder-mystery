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
                <div key={idx} className="  space-y-3">
                    <span className="text-sm font-semibold text-head-brown">조합 #{idx + 1}</span>
                    <div className="grid md:grid-cols-2 gap-3">
                        {combo.groups.map((group, gIdx) => (
                            <div key={gIdx} className="section-card">
                                <div className="font-semibold text-md mb-1">{group.game.name}</div>
                                <div className="text-xs text-slate-600 mb-2">
                                    {group.game.minPlayers}
                                    {group.game.maxPlayers ? `-${group.game.maxPlayers}` : "+"}인
                                    {group.game.company && ` · ${group.game.company}`}
                                </div>
                                <div className="border"></div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {group.playerNames.map((name) => (
                                        <span
                                            key={name}
                                            className="px-3 py-1 text-sm font-bold bg-head-badge text-head-brown"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {combo.unusedPlayers.length > 0 && (
                        <div className="text-xs text-slate-500 pt-2">
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
