import type { DomainEvent } from "@shared/domain/events/DomainEvent";
import type { EventHandler, IEventBus } from "@shared/domain/events/IEventBus";

export class InProcessEventBus implements IEventBus {
    private handlers = new Map<string, EventHandler[]>();

    subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
        const existing = this.handlers.get(eventName) ?? [];
        existing.push(handler as EventHandler);
        this.handlers.set(eventName, existing);
    }

    async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.name) ?? [];
        for (const handler of handlers) {
            await handler(event);
        }
    }
}
