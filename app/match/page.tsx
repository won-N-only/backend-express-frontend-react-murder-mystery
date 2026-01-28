"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MatchPage() {
    const { data: playersData } = useSWR("/api/players", fetcher);
    const players = playersData?.players ?? [];

    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [playerCount, setPlayerCount] = useState<number>(4);
    const [useCombination, setUseCombination] = useState<boolean>(true);
    const [excludePartySeries, setExcludePartySeries] = useState<boolean>(false);
    const [excludeSinglePlayer, setExcludeSinglePlayer] = useState<boolean>(false);
    const [matches, setMatches] = useState<any[]>([]);
    const [combinations, setCombinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const togglePlayer = (id: string) => {
        setSelectedPlayers((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    };

    const handleMatch = async () => {
        if (!selectedPlayers.length) return;
        setLoading(true);
        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    playerIds: selectedPlayers,
                    playerCount: useCombination ? undefined : playerCount,
                    useCombination,
                    excludePartySeries,
                    excludeSinglePlayer,
                }),
            });
            const json = await res.json();
            if (json.type === "combination") {
                setCombinations(json.combinations ?? []);
                setMatches([]);
            } else {
                setMatches(json.matches ?? []);
                setCombinations([]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">게임 매칭</h1>
            <section className="rounded-2xl bg-white/80 shadow p-6 space-y-4">
                <div>
                    <h2 className="font-semibold">참가자 선택</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        선택된 참가자: {selectedPlayers.length}명
                    </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-700 mb-3">옵션 설정</div>
                    <div className="space-y-2.5">
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useCombination}
                                onChange={(e) => setUseCombination(e.target.checked)}
                                className="rounded w-4 h-4 text-blue-600"
                            />
                            <span className="select-none">조합 매칭</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={excludePartySeries}
                                onChange={(e) => setExcludePartySeries(e.target.checked)}
                                className="rounded w-4 h-4 text-blue-600"
                            />
                            <span className="select-none">파티시리즈 제외</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={excludeSinglePlayer}
                                onChange={(e) => setExcludeSinglePlayer(e.target.checked)}
                                className="rounded w-4 h-4 text-blue-600"
                            />
                            <span className="select-none">1인용 게임 제외</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {players.map((p: any) => (
                        <button
                            key={p._id}
                            type="button"
                            onClick={() => togglePlayer(p._id)}
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

                {!useCombination && (
                    <div className="flex items-center gap-4 pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm">
                            <span>플레이 인원</span>
                            <input
                                type="number"
                                min={2}
                                max={10}
                                value={playerCount}
                                onChange={(e) =>
                                    setPlayerCount(parseInt(e.target.value || "2", 10))
                                }
                                className="w-16 rounded border px-2 py-1 text-center"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleMatch}
                    disabled={loading || !selectedPlayers.length}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold disabled:bg-slate-400 hover:bg-blue-700 transition"
                >
                    {loading ? "매칭 중..." : useCombination ? "조합 추천 보기" : "추천 게임 보기"}
                </button>
            </section>

            {/* 조합 결과 */}
            {combinations.length > 0 && (
                <section className="space-y-4">
                    <h2 className="font-semibold text-lg">추천 조합 {combinations.length}개</h2>
                    {combinations.map((combo: any, idx: number) => (
                        <div
                            key={idx}
                            className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-700">
                                    조합 #{idx + 1}
                                </span>
                                <span className="text-xs text-slate-600">
                                    점수 {Math.round(combo.totalScore)}
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                {combo.groups.map((group: any, gIdx: number) => (
                                    <div
                                        key={gIdx}
                                        className="rounded-lg bg-white/90 shadow-sm p-3 border border-blue-100"
                                    >
                                        <div className="font-semibold text-sm mb-1">
                                            {group.game.name}
                                        </div>
                                        <div className="text-xs text-slate-600 mb-2">
                                            {group.game.minPlayers}
                                            {group.game.maxPlayers
                                                ? `-${group.game.maxPlayers}`
                                                : "+"}
                                            인{group.game.company && ` · ${group.game.company}`}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {group.playerNames.map((name: string) => (
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
                                        {group.allIncomplete && (
                                            <div className="mt-1 text-xs text-emerald-600 font-medium">
                                                ✨ 모두 미완료
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {combo.unusedPlayers.length > 0 && (
                                <div className="text-xs text-slate-500 pt-2 border-t">
                                    사용 안 됨:{" "}
                                    {combo.unusedPlayers
                                        .map((id: string) => {
                                            const p = players.find((p: any) => p._id === id);
                                            return p?.name || id;
                                        })
                                        .join(", ")}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* 단일 게임 결과 */}
            {matches.length > 0 && (
                <section className="space-y-3">
                    <h2 className="font-semibold">추천 게임 {matches.length}개</h2>
                    {matches.map((g: any) => (
                        <div
                            key={g._id}
                            className="rounded-xl bg-white/80 shadow px-4 py-3 flex justify-between"
                        >
                            <div>
                                <div className="font-semibold text-sm">{g.name}</div>
                                <div className="text-xs text-slate-500">
                                    {g.minPlayers}
                                    {g.maxPlayers ? `-${g.maxPlayers}` : "+"}인
                                    {g.company && ` · ${g.company}`}
                                </div>
                                {!!g.incompletePlayers?.length && (
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
                </section>
            )}
        </div>
    );
}
