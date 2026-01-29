interface MatchOptionsProps {
    excludePartySeries: boolean;
    excludeSinglePlayer: boolean;
    excludeTwoPlayer: boolean;
    numGroups?: number;
    selectedPlayersCount?: number;
    onExcludePartySeriesChange: (value: boolean) => void;
    onExcludeSinglePlayerChange: (value: boolean) => void;
    onExcludeTwoPlayerChange: (value: boolean) => void;
    onNumGroupsChange?: (value: number) => void;
}

export default function MatchOptions({
    excludePartySeries,
    excludeSinglePlayer,
    excludeTwoPlayer,
    numGroups,
    selectedPlayersCount = 0,
    onExcludePartySeriesChange,
    onExcludeSinglePlayerChange,
    onExcludeTwoPlayerChange,
    onNumGroupsChange,
}: MatchOptionsProps) {
    return (
        <div className="bg-head-gray-100 rounded-lg p-3 border border-head-gray-300">
            <div className="text-xs font-semibold text-head-gray-800 mb-3">옵션 설정</div>
            <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excludePartySeries}
                        onChange={(e) => onExcludePartySeriesChange(e.target.checked)}
                        className="rounded w-4 h-4 text-head-blue focus:ring-head-blue"
                    />
                    <span className="select-none text-head-gray-800">파티시리즈 제외</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excludeSinglePlayer}
                        onChange={(e) => onExcludeSinglePlayerChange(e.target.checked)}
                        className="rounded w-4 h-4 text-head-blue focus:ring-head-blue"
                    />
                    <span className="select-none text-head-gray-800">1인용 게임 제외</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={excludeTwoPlayer}
                        onChange={(e) => onExcludeTwoPlayerChange(e.target.checked)}
                        className="rounded w-4 h-4 text-head-blue focus:ring-head-blue"
                    />
                    <span className="select-none text-head-gray-800">2인용 게임 제외</span>
                </label>
            </div>
            {onNumGroupsChange && (
                <div className="flex items-center gap-4 pt-2 border-t border-head-gray-300 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-head-gray-800">조합당 게임 수</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={numGroups ?? ""}
                            placeholder="자동"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    onNumGroupsChange(undefined as any);
                                } else {
                                    const num = parseInt(value, 10);
                                    if (!isNaN(num) && num >= 2 && num <= 5) {
                                        onNumGroupsChange(num);
                                    }
                                }
                            }}
                            className="w-20 rounded border border-head-gray-300 px-2 py-1 text-center text-head-gray-800 focus:outline-none focus:ring-2 focus:ring-head-blue"
                        />
                        <span className="text-xs text-head-gray-500">
                            (최대 {selectedPlayersCount}개)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
