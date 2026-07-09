import type { CreateIndexesOptions, Db, IndexSpecification } from "mongodb";

const INDEX_OPTIONS_CONFLICT = 85;
const INDEX_KEY_SPECS_CONFLICT = 86;
const DUPLICATE_KEY = 11000;

/**
 * createIndex 후, 같은 이름의 인덱스가 다른 옵션/키로 이미 존재하면 drop 후 재생성한다.
 * (기동 시마다 호출되므로 옵션 변경이 배포만으로 반영되게 하기 위함)
 */
async function ensureIndex(
    db: Db,
    collectionName: string,
    keys: IndexSpecification,
    options: CreateIndexesOptions & { name: string },
): Promise<void> {
    const collection = db.collection(collectionName);
    try {
        await collection.createIndex(keys, options);
    } catch (error) {
        const code = (error as { code?: number }).code;
        if (code === INDEX_OPTIONS_CONFLICT || code === INDEX_KEY_SPECS_CONFLICT) {
            // 이름이 아닌 키 스펙으로 drop (이름이 다른 기존 인덱스가 같은 키를 가진 경우 대비)
            try {
                await collection.dropIndex(options.name);
            } catch {
                await collection.dropIndex(keys as any);
            }
            await collection.createIndex(keys, options);
            return;
        }
        throw error;
    }
}

export async function ensureIndexes(db: Db): Promise<void> {
    await Promise.all([
        // gameCompletions: upsert 조회 (gameId + playerId)
        // 두 필드 모두 항상 존재하므로 sparse는 무의미해서 제거됨
        ensureIndex(db, "gameCompletions",
            { gameId: 1, playerId: 1 },
            { unique: true, name: "idx_completions_gameId_playerId" },
        ),
        // gameCompletions: 플레이어별 완료 게임 조회
        ensureIndex(db, "gameCompletions",
            { playerId: 1, status: 1, deletedAt: 1 },
            { name: "idx_completions_playerId_status" },
        ),
        // gameCompletions: stats aggregation (status ESA 인덱스)
        ensureIndex(db, "gameCompletions",
            { status: 1, gameId: 1, playerId: 1, deletedAt: 1 },
            { name: "idx_completions_status_gameId_playerId" },
        ),
        // statSnapshots: type + entityId 조합 unique
        ensureIndex(db, "statSnapshots",
            { type: 1, entityId: 1 },
            { unique: true, name: "idx_snapshots_type_entityId" },
        ),
        // comments: 게임별 댓글 조회 + createdAt 정렬
        ensureIndex(db, "comments",
            { gameId: 1, deletedAt: 1, createdAt: 1 },
            { name: "idx_comments_gameId_deletedAt_createdAt" },
        ),
        // games: 목록 조회 (deletedAt/category 필터 + orderNumber 정렬)
        ensureIndex(db, "games",
            { deletedAt: 1, category: 1, orderNumber: 1 },
            { name: "idx_games_deletedAt_category_orderNumber" },
        ),
        // players: 이름 기반 upsert 경합 시 중복 생성 방지
        ensureIndex(db, "players",
            { name: 1 },
            { unique: true, name: "idx_players_name_unique" },
        ).catch((error) => {
            // 기존 데이터에 중복 이름이 있으면 인덱스 생성만 실패한다.
            // 앱 기동은 막지 않고, 중복 정리 후 재기동하면 자동 생성된다.
            if ((error as { code?: number }).code === DUPLICATE_KEY) {
                console.warn(
                    "[ensureIndexes] players.name unique 인덱스 생성 실패 (중복 이름 존재). 중복 정리 필요:",
                    (error as Error).message,
                );
                return;
            }
            throw error;
        }),
    ]);
}
