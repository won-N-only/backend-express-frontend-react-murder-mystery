import type { Db } from "mongodb";

export async function ensureIndexes(db: Db): Promise<void> {
    await Promise.all([
        // gameCompletions: upsert 조회 (gameId + playerId)
        db.collection("gameCompletions").createIndex(
            { gameId: 1, playerId: 1 },
            { unique: true, sparse: true, name: "idx_completions_gameId_playerId" },
        ),
        // gameCompletions: 플레이어별 완료 게임 조회
        db.collection("gameCompletions").createIndex(
            { playerId: 1, status: 1, deletedAt: 1 },
            { name: "idx_completions_playerId_status" },
        ),
        // gameCompletions: stats aggregation (status ESA 인덱스)
        db.collection("gameCompletions").createIndex(
            { status: 1, gameId: 1, playerId: 1, deletedAt: 1 },
            { name: "idx_completions_status_gameId_playerId" },
        ),
        // statSnapshots: type + entityId 조합 unique
        db.collection("statSnapshots").createIndex(
            { type: 1, entityId: 1 },
            { unique: true, name: "idx_snapshots_type_entityId" },
        ),
    ]);
}
