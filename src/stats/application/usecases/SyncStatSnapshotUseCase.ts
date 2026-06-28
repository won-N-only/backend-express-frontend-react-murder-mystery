import type { IStatSnapshotRepository } from "@stats/domain/repositories/IStatSnapshotRepository";

export class SyncStatSnapshotUseCase {
    constructor(private statSnapshotRepository: IStatSnapshotRepository) {}

    async execute(gameId: string, playerId: string, delta: number): Promise<void> {
        if (delta === 0) return;
        await Promise.all([
            this.statSnapshotRepository.incrementPlayerCount(playerId, delta),
            this.statSnapshotRepository.incrementGameCount(gameId, delta),
        ]);
    }
}
