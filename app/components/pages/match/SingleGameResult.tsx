import type { MatchGame } from "@app/types";

interface SingleGameResultProps {
    matches: MatchGame[];
    limit?: number;
    onGameClick?: (gameId: string) => void;
}

export default function SingleGameResult({ matches, limit, onGameClick }: SingleGameResultProps) {
    const displayMatches = limit ? matches.slice(0, limit) : matches;

    return (
        <section className="space-y-section">
            <h2 className="text-lg font-semibold">추천 게임 {matches.length}개</h2>
            <div className="space-y-3">
                {displayMatches.map((g) => (
                    <div
                        key={g._id}
                        onClick={() => onGameClick?.(g._id)}
                        className={`rounded-xl bg-head-white/80 shadow px-4 py-3 flex justify-between ${onGameClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                    >
                        <div>
                            <div className="font-semibold">{g.name}</div>
                            <div className="text-xs text-head-text">
                                {g.minPlayers}
                                {g.maxPlayers ? `-${g.maxPlayers}` : "+"}인
                                {g.company && ` · ${g.company}`}
                            </div>
                            {!!g.incompletePlayers.length && (
                                <div className="mt-1 text-xs text-emerald-700">
                                    미완료: {g.incompletePlayers.join(", ")}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
