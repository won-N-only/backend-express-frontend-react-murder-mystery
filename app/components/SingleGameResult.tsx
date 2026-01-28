import type { MatchGame } from "../types";

interface SingleGameResultProps {
    matches: MatchGame[];
    limit?: number;
}

export default function SingleGameResult({ matches, limit }: SingleGameResultProps) {
    const displayMatches = limit ? matches.slice(0, limit) : matches;

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">추천 게임 {matches.length}개</h2>
            <div className="space-y-3">
                {displayMatches.map((g) => (
                    <div
                        key={g._id}
                        className="rounded-xl bg-white/80 shadow px-4 py-3 flex justify-between"
                    >
                        <div>
                            <div className="font-semibold">{g.name}</div>
                            <div className="text-xs text-slate-500">
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
                        <div className="text-xs text-slate-500 self-center">
                            점수 {Math.round(g.matchScore)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
