import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@shared/domain/events/DomainEvent";
import { InProcessEventBus } from "@shared/infrastructure/events/InProcessEventBus";

class TestEvent implements DomainEvent {
    static readonly NAME = "test.happened";
    readonly name = TestEvent.NAME;
    readonly occurredAt = new Date();
    constructor(public readonly payload: string) {}
}

describe("InProcessEventBus", () => {
    it("구독한 핸들러에 이벤트를 전달한다", async () => {
        const bus = new InProcessEventBus();
        const received: string[] = [];
        bus.subscribe<TestEvent>(TestEvent.NAME, async (e) => {
            received.push(e.payload);
        });

        await bus.publish(new TestEvent("hello"));

        expect(received).toEqual(["hello"]);
    });

    it("구독자가 없으면 아무 일도 일어나지 않는다", async () => {
        const bus = new InProcessEventBus();
        await expect(bus.publish(new TestEvent("x"))).resolves.toBeUndefined();
    });

    it("같은 이벤트의 모든 핸들러를 호출한다", async () => {
        const bus = new InProcessEventBus();
        const calls: number[] = [];
        bus.subscribe(TestEvent.NAME, async () => {
            calls.push(1);
        });
        bus.subscribe(TestEvent.NAME, async () => {
            calls.push(2);
        });

        await bus.publish(new TestEvent("x"));

        expect(calls).toEqual([1, 2]);
    });

    it("publish는 비동기 핸들러 완료를 기다린다", async () => {
        const bus = new InProcessEventBus();
        let done = false;
        bus.subscribe(TestEvent.NAME, async () => {
            await new Promise((r) => setTimeout(r, 10));
            done = true;
        });

        await bus.publish(new TestEvent("x"));

        expect(done).toBe(true);
    });

    it("다른 이름의 이벤트는 전달하지 않는다", async () => {
        const bus = new InProcessEventBus();
        const received: string[] = [];
        bus.subscribe("other.event", async () => {
            received.push("wrong");
        });

        await bus.publish(new TestEvent("x"));

        expect(received).toEqual([]);
    });
});
