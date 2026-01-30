"use client";

import { fetcher } from "@app/lib/fetcher";
import type { CompletedGame } from "@app/types";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import GameListItem from "./GameListItem";
import GameListModal from "./GameListModal";

interface CompletedGamesModalProps {
    playerId: string | null;
    playerName: string | null;
    onClose: () => void;
    /** 제공 시 게임 클릭 시 이 콜백만 호출(모달 열기). 미제공 시 /games?gameId= 로 이동 */
    onOpenGameDetail?: (gameId: string) => void;
}

export default function CompletedGamesModal({
    playerId,
    playerName,
    onClose,
    onOpenGameDetail,
}: CompletedGamesModalProps) {
    const router = useRouter();
    const { data: completedGamesData, isLoading } = useSWR<{ completedGames: CompletedGame[] }>(
        playerId ? `/api/stats/players/${playerId}/completed-games` : null,
        fetcher,
    );
    const completedGames = completedGamesData?.completedGames ?? [];

    if (!playerId) return null;

    return (
        <GameListModal
            title={`${playerName}님의 완료한 게임`}
            subtitle={`총 ${completedGames.length}개 완료`}
            onClose={onClose}
            isLoading={isLoading}
            isEmpty={completedGames.length === 0}
            emptyMessage="완료한 게임이 없습니다."
        >
            {completedGames.map((game) => (
                <GameListItem
                    key={game.gameId}
                    orderNumber={game.orderNumber}
                    title={game.gameName}
                    subtitle={
                        game.completedAt
                            ? `완료일: ${new Date(game.completedAt).toLocaleDateString("ko-KR")}`
                            : undefined
                    }
                    action={
                        <span className="text-xs font-semibold text-head-brown bg-head-brown/10 px-3 py-1 rounded-full">
                            완료
                        </span>
                    }
                    onClick={() => {
                        if (onOpenGameDetail) {
                            onClose();
                            onOpenGameDetail(game.gameId);
                        } else {
                            onClose();
                            router.push(`/games?gameId=${game.gameId}`);
                        }
                    }}
                />
            ))}
        </GameListModal>
    );
}
