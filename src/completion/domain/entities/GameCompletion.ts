import type { ObjectId } from "mongodb";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";

export class GameCompletion {
    constructor(
        public readonly id: ObjectId | undefined,
        public readonly gameId: ObjectId,
        public readonly playerId: ObjectId,
        public readonly status: CompletionStatus,
        public readonly completedAt: Date | null,
    ) { }

    /**
     * 완료 상태인지 확인
     */
    isCompleted(): boolean {
        return this.status === CompletionStatus.DONE;
    }

    /**
     * 미완료 상태인지 확인
     */
    isIncomplete(): boolean {
        return this.status !== CompletionStatus.DONE;
    }
}
