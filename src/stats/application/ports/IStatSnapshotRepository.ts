export interface IStatSnapshotRepository {
    /** playerId의 completedCount를 delta만큼 증감 (upsert) */
    incrementPlayerCount(playerId: string, delta: number): Promise<void>;
    /** gameId의 completedCount를 delta만큼 증감 (upsert) */
    incrementGameCount(gameId: string, delta: number): Promise<void>;
    /** 여러 플레이어의 completedCount를 한 번에 조회 */
    getPlayerCounts(playerIds: string[]): Promise<Map<string, number>>;
    /** 여러 게임의 completedCount를 한 번에 조회 */
    getGameCounts(gameIds: string[]): Promise<Map<string, number>>;
    /** 스냅샷 전체 재구축 (마이그레이션용) */
    rebuildAll(
        playerCounts: { playerId: string; count: number }[],
        gameCounts: { gameId: string; count: number }[],
    ): Promise<void>;
}
