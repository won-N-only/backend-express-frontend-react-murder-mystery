import Checkbox from "@app/components/common/Checkbox";

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
        <div className="bg-white p-3 border border-head-brown">
            <div className="text-sm font-bold text-head-gray-800 mb-2">옵션 설정</div>
            <div className="space-y-2.5">
                <Checkbox
                    checked={excludePartySeries}
                    onChange={onExcludePartySeriesChange}
                    label="파티시리즈 제외"
                />
                <Checkbox
                    checked={excludeSinglePlayer}
                    onChange={onExcludeSinglePlayerChange}
                    label="1인용 게임 제외"
                />
                <Checkbox
                    checked={excludeTwoPlayer}
                    onChange={onExcludeTwoPlayerChange}
                    label="2인용 게임 제외"
                />
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
                            className="w-20 border border-head-gray-300 px-2 py-0.5 text-sm text-center text-head-gray-800 focus:outline-none focus:ring-1"
                        />
                        <span className="text-xs text-head-gray-500">
                            (최대 {Math.min(selectedPlayersCount, 5)}개)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
