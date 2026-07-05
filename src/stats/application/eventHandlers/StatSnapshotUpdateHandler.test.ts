import { describe, expect, it } from "vitest";
import { CompletionDeletedEvent, CompletionUpsertedEvent } from "@completion/domain/events/CompletionEvents";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { InProcessEventBus } from "@shared/infrastructure/events/InProcessEventBus";
import { StatSnapshotUpdateHandler } from "@stats/application/eventHandlers/StatSnapshotUpdateHandler";
import type { IStatSnapshotRepository } from "@stats/application/ports/IStatSnapshotRepository";

function makeFakeStatRepo() {
    const calls: { method: string; id: string; delta: number }[] = [];
    const repo: IStatSnapshotRepository = {
        incrementPlayerCount: async (playerId, delta) => {
            calls.push({ method: "player", id: playerId, delta });
        },
        incrementGameCount: async (gameId, delta) => {
            calls.push({ method: "game", id: gameId, delta });
        },
        getPlayerCounts: async () => new Map(),
        getGameCounts: async () => new Map(),
        rebuildAll: async () => {},
    };
    return { repo, calls };
}

function setup() {
    const bus = new InProcessEventBus();
    const { repo, calls } = makeFakeStatRepo();
    new StatSnapshotUpdateHandler(repo).subscribeTo(bus);
    return { bus, calls };
}

describe("StatSnapshotUpdateHandler", () => {
    it("미완료→완료 upsert 시 +1 증가시킨다", async () => {
        const { bus, calls } = setup();

        await bus.publish(new CompletionUpsertedEvent("g1", "p1", CompletionStatus.NOT_DONE, CompletionStatus.DONE));

        expect(calls).toContainEqual({ method: "player", id: "p1", delta: 1 });
        expect(calls).toContainEqual({ method: "game", id: "g1", delta: 1 });
    });

    it("완료→미완료 upsert 시 -1 감소시킨다", async () => {
        const { bus, calls } = setup();

        await bus.publish(new CompletionUpsertedEvent("g1", "p1", CompletionStatus.DONE, CompletionStatus.NOT_DONE));

        expect(calls).toContainEqual({ method: "player", id: "p1", delta: -1 });
        expect(calls).toContainEqual({ method: "game", id: "g1", delta: -1 });
    });

    it("상태 변화가 없으면 repo를 호출하지 않는다", async () => {
        const { bus, calls } = setup();

        await bus.publish(new CompletionUpsertedEvent("g1", "p1", CompletionStatus.DONE, CompletionStatus.DONE));

        expect(calls).toEqual([]);
    });

    it("DONE 레코드 삭제 시 -1 감소시킨다", async () => {
        const { bus, calls } = setup();

        await bus.publish(new CompletionDeletedEvent("g1", "p1", CompletionStatus.DONE));

        expect(calls).toContainEqual({ method: "player", id: "p1", delta: -1 });
        expect(calls).toContainEqual({ method: "game", id: "g1", delta: -1 });
    });

    it("NOT_DONE 레코드 삭제 시 repo를 호출하지 않는다", async () => {
        const { bus, calls } = setup();

        await bus.publish(new CompletionDeletedEvent("g1", "p1", CompletionStatus.NOT_DONE));

        expect(calls).toEqual([]);
    });
});
