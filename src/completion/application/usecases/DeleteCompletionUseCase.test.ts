import { describe, expect, it } from "vitest";
import { DeleteCompletionUseCase } from "@completion/application/usecases/DeleteCompletionUseCase";
import { CompletionDeletedEvent } from "@completion/domain/events/CompletionEvents";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { InProcessEventBus } from "@shared/infrastructure/events/InProcessEventBus";
import { ObjectId } from "mongodb";

function makeFakeRepo(deleteResult: CompletionStatus | null): IGameCompletionRepository {
    return {
        findByGameIdAndPlayerId: async () => null,
        upsert: async () => {
            throw new Error("not used");
        },
        delete: async () => deleteResult,
        findByGameId: async () => [],
        findByGameIdAndPlayerIds: async () => [],
        findByGameIdsAndPlayerIds: async () => [],
        findByPlayerId: async () => [],
        countByGameIds: async () => [],
        countByPlayerIds: async () => [],
    };
}

const GAME_ID = new ObjectId().toString();
const PLAYER_ID = new ObjectId().toString();

describe("DeleteCompletionUseCase", () => {
    it("삭제 성공 시 CompletionDeletedEvent를 발행한다", async () => {
        const bus = new InProcessEventBus();
        const events: CompletionDeletedEvent[] = [];
        bus.subscribe<CompletionDeletedEvent>(CompletionDeletedEvent.NAME, async (e) => {
            events.push(e);
        });
        const useCase = new DeleteCompletionUseCase(makeFakeRepo(CompletionStatus.DONE), bus);

        const result = await useCase.execute(GAME_ID, PLAYER_ID);

        expect(result.deleted).toBe(true);
        expect(events).toHaveLength(1);
        expect(events[0].previousStatus).toBe(CompletionStatus.DONE);
    });

    it("레코드가 없으면 이벤트를 발행하지 않는다", async () => {
        const bus = new InProcessEventBus();
        const events: CompletionDeletedEvent[] = [];
        bus.subscribe<CompletionDeletedEvent>(CompletionDeletedEvent.NAME, async (e) => {
            events.push(e);
        });
        const useCase = new DeleteCompletionUseCase(makeFakeRepo(null), bus);

        const result = await useCase.execute(GAME_ID, PLAYER_ID);

        expect(result.deleted).toBe(false);
        expect(events).toHaveLength(0);
    });
});
