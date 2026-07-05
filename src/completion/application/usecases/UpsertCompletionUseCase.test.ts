import { describe, expect, it } from "vitest";
import { UpsertCompletionUseCase } from "@completion/application/usecases/UpsertCompletionUseCase";
import { GameCompletion } from "@completion/domain/entities/GameCompletion";
import { CompletionUpsertedEvent } from "@completion/domain/events/CompletionEvents";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { InProcessEventBus } from "@shared/infrastructure/events/InProcessEventBus";
import { ObjectId } from "mongodb";

function makeFakeRepo(existing: GameCompletion | null): IGameCompletionRepository {
    return {
        findByGameIdAndPlayerId: async () => existing,
        upsert: async (gameId, playerId, status) =>
            new GameCompletion(new ObjectId(), new ObjectId(gameId), new ObjectId(playerId), status, status === CompletionStatus.DONE ? new Date() : null),
        delete: async () => {
            throw new Error("not used");
        },
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

describe("UpsertCompletionUseCase", () => {
    it("완료 등록 시 CompletionUpsertedEvent를 발행한다", async () => {
        const bus = new InProcessEventBus();
        const events: CompletionUpsertedEvent[] = [];
        bus.subscribe<CompletionUpsertedEvent>(CompletionUpsertedEvent.NAME, async (e) => {
            events.push(e);
        });
        const useCase = new UpsertCompletionUseCase(makeFakeRepo(null), bus);

        await useCase.execute(GAME_ID, PLAYER_ID, CompletionStatus.DONE);

        expect(events).toHaveLength(1);
        expect(events[0].gameId).toBe(GAME_ID);
        expect(events[0].playerId).toBe(PLAYER_ID);
        expect(events[0].previousStatus).toBe(CompletionStatus.NOT_DONE);
        expect(events[0].newStatus).toBe(CompletionStatus.DONE);
    });

    it("기존 상태가 있으면 previousStatus에 담아 발행한다", async () => {
        const existing = new GameCompletion(new ObjectId(), new ObjectId(GAME_ID), new ObjectId(PLAYER_ID), CompletionStatus.DONE, new Date());
        const bus = new InProcessEventBus();
        const events: CompletionUpsertedEvent[] = [];
        bus.subscribe<CompletionUpsertedEvent>(CompletionUpsertedEvent.NAME, async (e) => {
            events.push(e);
        });
        const useCase = new UpsertCompletionUseCase(makeFakeRepo(existing), bus);

        await useCase.execute(GAME_ID, PLAYER_ID, CompletionStatus.NOT_DONE);

        expect(events[0].previousStatus).toBe(CompletionStatus.DONE);
        expect(events[0].newStatus).toBe(CompletionStatus.NOT_DONE);
    });

    it("completion 엔티티를 반환한다", async () => {
        const useCase = new UpsertCompletionUseCase(makeFakeRepo(null), new InProcessEventBus());
        const result = await useCase.execute(GAME_ID, PLAYER_ID, CompletionStatus.DONE);
        expect(result.completion.status).toBe(CompletionStatus.DONE);
    });
});
