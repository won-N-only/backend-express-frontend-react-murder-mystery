import { CompletionDeletedEvent, CompletionUpsertedEvent } from "@completion/domain/events/CompletionEvents";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IEventBus } from "@shared/domain/events/IEventBus";
import type { IStatSnapshotRepository } from "@stats/application/ports/IStatSnapshotRepository";

/**
 * completion 도메인 이벤트를 구독해 stat snapshot(materialized view)을 증분 갱신한다.
 */
export class StatSnapshotUpdateHandler {
    constructor(private statSnapshotRepository: IStatSnapshotRepository) {}

    subscribeTo(eventBus: IEventBus): void {
        eventBus.subscribe<CompletionUpsertedEvent>(CompletionUpsertedEvent.NAME, (event) =>
            this.applyDelta(event.gameId, event.playerId, this.deltaOf(event.previousStatus, event.newStatus)),
        );
        eventBus.subscribe<CompletionDeletedEvent>(CompletionDeletedEvent.NAME, (event) =>
            this.applyDelta(event.gameId, event.playerId, this.deltaOf(event.previousStatus, CompletionStatus.NOT_DONE)),
        );
    }

    private deltaOf(previous: CompletionStatus, next: CompletionStatus): number {
        return (next === CompletionStatus.DONE ? 1 : 0) - (previous === CompletionStatus.DONE ? 1 : 0);
    }

    private async applyDelta(gameId: string, playerId: string, delta: number): Promise<void> {
        if (delta === 0) return;
        await Promise.all([
            this.statSnapshotRepository.incrementPlayerCount(playerId, delta),
            this.statSnapshotRepository.incrementGameCount(gameId, delta),
        ]);
    }
}
