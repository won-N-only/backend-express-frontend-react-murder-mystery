import type { DomainEvent } from "./DomainEvent";

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

export interface IEventBus {
    publish(event: DomainEvent): Promise<void>;
    subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void;
}
