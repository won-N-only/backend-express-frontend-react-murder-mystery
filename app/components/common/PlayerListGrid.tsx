import type { Player } from "@app/types";

interface PlayerListGridProps {
    players: Player[];
    /** 선택된 플레이어 id 목록 (단일 선택이면 길이 0 또는 1) */
    selectedPlayerIds: string[];
    /** 플레이어 클릭 시 (단일: 해당 id 선택, 복수: 토글) */
    onSelectPlayer: (id: string) => void;
}

/**
 * 유저/플레이어 목록 버튼 그리드 (전과 기록·매칭 참가자 선택 등 공용).
 * user-list-btn 스타일 사용.
 */
export default function PlayerListGrid({
    players,
    selectedPlayerIds,
    onSelectPlayer,
}: PlayerListGridProps) {
    return (
        <div className="pt-5 grid grid-cols-3 md:grid-cols-6 gap-2">
            {players.map((p) => (
                <button
                    key={p._id}
                    type="button"
                    onClick={() => onSelectPlayer(p._id)}
                    className={`user-list-btn ${selectedPlayerIds.includes(p._id) ? "user-list-btn-selected" : ""}`}
                >
                    {p.name}
                </button>
            ))}
        </div>
    );
}
