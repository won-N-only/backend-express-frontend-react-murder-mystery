import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { Game } from "@game/domain/entities/Game";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";

export interface FindMatchesRequest {
    playerIds: string[];
    playerCount: number;
    excludePartySeries?: boolean;
    excludeSinglePlayer?: boolean;
}

export interface FindMatchesResult {
    game: Game;
    incompletePlayers: string[];
}

export class FindMatchesUseCase {
    constructor(
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
        private playerRepository: IPlayerRepository,
    ) { }

    async execute(options: FindMatchesRequest): Promise<FindMatchesResult[]> {
        const { playerIds, playerCount, excludePartySeries = false, excludeSinglePlayer = false } = options;

        // 게임 조회 (DB 레벨에서 기본 필터링)
        let games = await this.gameRepository.findByPlayerCount(playerCount, playerCount);

        // 메모리 레벨 필터링 (normalizedMinPlayers 로직 적용)
        games = games.filter((game) => {
            if (excludePartySeries && game.isPartySeries()) return false;
            if (excludeSinglePlayer && game.isSinglePlayer()) return false;
            // normalizedMinPlayers를 고려한 정확한 필터링
            return game.canAccommodatePlayers(playerCount);
        });

        if (games.length === 0) return [];

        // 완료 상태 및 플레이어를 한 번에 배치 조회
        const gameIds = games.map((g) => g.id!.toString());
        const [completions, players] = await Promise.all([
            this.completionRepository.findByGameIdsAndPlayerIds(gameIds, playerIds),
            this.playerRepository.findByIds(playerIds),
        ]);

        // 플레이어 이름 맵 미리 생성 (O(1) 조회)
        const playerNameMap = new Map<string, string>(
            players.map((p) => [p.id!.toString(), p.name]),
        );

        // 완료 상태 맵 미리 생성 (게임별, 플레이어별)
        const gameCompletionMap = new Map<string, Map<string, CompletionStatus>>();
        for (const completion of completions) {
            const gameIdStr = completion.gameId.toString();
            const playerIdStr = completion.playerId.toString();
            if (!gameCompletionMap.has(gameIdStr)) {
                gameCompletionMap.set(gameIdStr, new Map());
            }
            gameCompletionMap.get(gameIdStr)!.set(playerIdStr, completion.status);
        }

        const results: FindMatchesResult[] = [];

        for (const game of games) {
            const gameIdStr = game.id!.toString();
            const statusMap = gameCompletionMap.get(gameIdStr) || new Map();

            // 모두 미완료인 게임만 추천 (조기 종료)
            let hasCompleted = false;
            for (const playerId of playerIds) {
                if (statusMap.get(playerId) === CompletionStatus.DONE) {
                    hasCompleted = true;
                    break; // 하나라도 완료되면 즉시 중단
                }
            }

            if (hasCompleted) continue;

            // 모두 미완료인 경우에만 incompletePlayers 수집
            const incompletePlayers = playerIds
                .map((playerId) => playerNameMap.get(playerId))
                .filter((name): name is string => name !== undefined);

            results.push({
                game,
                incompletePlayers,
            });
        }

        // 랜덤 정렬
        return results.sort(() => Math.random() - 0.5);
    }
}
