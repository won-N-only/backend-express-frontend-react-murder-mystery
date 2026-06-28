import type { Combination, Player } from "@app/types";
import { Fragment } from "react";

interface CombinationResultProps {
    combinations: Combination[];
    players: Player[];
    onGameClick?: (gameId: string) => void;
}

export default function CombinationResult({ combinations, players, onGameClick }: CombinationResultProps) {
    return (
        <section className="mt-subtitle">
            {combinations.map((combo, idx) => (
                <Fragment key={idx}>
                    {idx > 0 && <div className="line mt-subtitle" aria-hidden />}
                    <div className={idx > 0 ? "mt-subtitle space-y-3" : "space-y-3"}>
                        <span className="text-sm font-semibold text-head-text">
                            조합 #{idx + 1}
                        </span>
                        <div className="grid md:grid-cols-2 gap-3">
                            {combo.groups.map((group, gIdx) => (
                                <div
                                    key={gIdx}
                                    className={`section-card ${onGameClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                                    onClick={() => onGameClick?.(group.game._id)}
                                >
                                    <div className="font-semibold text-xl">{group.game.name}</div>
                                    <div className="text-sm text-head-text mt-1">
                                        {group.game.minPlayers}
                                        {group.game.maxPlayers ? `-${group.game.maxPlayers}` : "+"}
                                        인{group.game.company && ` · ${group.game.company}`}
                                    </div>
                                    <hr className="border-head-border mt-2"></hr>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {group.playerNames.map((name) => (
                                            <span
                                                key={name}
                                                className="px-3 py-1 text-sm font-extrabold bg-head-badge text-head-brown"
                                            >
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {combo.unusedPlayers.length > 0 && (
                            <div className="text-xs text-head-text pt-2">
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
                </Fragment>
            ))}
        </section>
    );
}
