import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { DomainEvent } from "@shared/domain/events/DomainEvent";

export class CompletionUpsertedEvent implements DomainEvent {
    static readonly NAME = "completion.upserted";
    readonly name = CompletionUpsertedEvent.NAME;
    readonly occurredAt = new Date();

    constructor(
        public readonly gameId: string,
        public readonly playerId: string,
        public readonly previousStatus: CompletionStatus,
        public readonly newStatus: CompletionStatus,
    ) {}
}

export class CompletionDeletedEvent implements DomainEvent {
    static readonly NAME = "completion.deleted";
    readonly name = CompletionDeletedEvent.NAME;
    readonly occurredAt = new Date();

    constructor(
        public readonly gameId: string,
        public readonly playerId: string,
        public readonly previousStatus: CompletionStatus,
    ) {}
}
