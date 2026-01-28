interface MatchOptionsProps {
    useCombination: boolean;
    excludePartySeries: boolean;
    excludeSinglePlayer: boolean;
    playerCount: number;
    onUseCombinationChange: (value: boolean) => void;
    onExcludePartySeriesChange: (value: boolean) => void;
    onExcludeSinglePlayerChange: (value: boolean) => void;
    onPlayerCountChange: (value: number) => void;
}

export default function MatchOptions({
    useCombination,
    excludePartySeries,
    excludeSinglePlayer,
    playerCount,
    onUseCombinationChange,
    onExcludePartySeriesChange,
    onExcludeSinglePlayerChange,
    onPlayerCountChange,
}: MatchOptionsProps) {
    return (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 mb-3">옵션 설정</div>
            <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useCombination}
                        onChange={(e) => onUseCombinationChange(e.target.checked)}
                        className="rounded w-4 h-4 text-blue-600"
                    />
                    <span className="select-none">조합 매칭</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excludePartySeries}
                        onChange={(e) => onExcludePartySeriesChange(e.target.checked)}
                        className="rounded w-4 h-4 text-blue-600"
                    />
                    <span className="select-none">파티시리즈 제외</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excludeSinglePlayer}
                        onChange={(e) => onExcludeSinglePlayerChange(e.target.checked)}
                        className="rounded w-4 h-4 text-blue-600"
                    />
                    <span className="select-none">1인용 게임 제외</span>
                </label>
            </div>
            {!useCombination && (
                <div className="flex items-center gap-4 pt-2 border-t mt-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span>플레이 인원</span>
                        <input
                            type="number"
                            min={2}
                            max={10}
                            value={playerCount}
                            onChange={(e) =>
                                onPlayerCountChange(parseInt(e.target.value || "2", 10))
                            }
                            className="w-16 rounded border px-2 py-1 text-center"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
