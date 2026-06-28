import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";
import type { IStatSnapshotRepository } from "@stats/domain/repositories/IStatSnapshotRepository";

/**
 * 기존 completion 데이터로부터 statSnapshots 컬렉션을 전체 재구축합니다.
 * 최초 배포 시 또는 데이터 불일치 발생 시 한 번만 실행합니다.
 */
export class RebuildStatSnapshotsUseCase {
    constructor(
        private gameRepository: IGameRepository,
        private playerRepository: IPlayerRepository,
        private completionRepository: IGameCompletionRepository,
        private statSnapshotRepository: IStatSnapshotRepository,
    ) {}

    async execute(): Promise<{ playerCount: number; gameCount: number }> {
        const [games, players] = await Promise.all([
            this.gameRepository.findAll(),
            this.playerRepository.findAll(),
        ]);

        if (games.length === 0 || players.length === 0) {
            return { playerCount: 0, gameCount: 0 };
        }

        const gameIds = games.map((g) => g.id!.toString());
        const playerIds = players.map((p) => p.id!.toString());

        const [playerCounts, gameCounts] = await Promise.all([
            this.completionRepository.countByPlayerIds(gameIds, playerIds, CompletionStatus.DONE),
            this.completionRepository.countByGameIds(gameIds, playerIds, CompletionStatus.DONE),
        ]);

        await this.statSnapshotRepository.rebuildAll(
            playerCounts.map((p) => ({ playerId: p.playerId, count: p.count })),
            gameCounts.map((g) => ({ gameId: g.gameId, count: g.count })),
        );

        return { playerCount: playerCounts.length, gameCount: gameCounts.length };
    }
}
