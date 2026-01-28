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
    matchScore: number;
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

        // 게임 조회
        let games = await this.gameRepository.findByPlayerCount(playerCount, playerCount);

        // 필터링
        games = games.filter((game) => {
            if (excludePartySeries && game.isPartySeries()) return false;
            if (excludeSinglePlayer && game.isSinglePlayer()) return false;
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

            let completedCount = 0;
            const incompletePlayers: string[] = [];

            for (const playerId of playerIds) {
                const status = statusMap.get(playerId);
                if (status === CompletionStatus.DONE) {
                    completedCount++;
                } else {
                    const playerName = playerNameMap.get(playerId);
                    if (playerName) incompletePlayers.push(playerName);
                }
            }

            // 모두 미완료인 게임만 추천
            if (completedCount > 0) continue;

            const total = playerIds.length || 1;
            const completionRate = completedCount / total;
            const allIncompleteBonus = completedCount === 0 ? 50 : 0;
            const matchScore = (1 - completionRate) * 100 + allIncompleteBonus;

            results.push({
                game,
                matchScore,
                incompletePlayers,
            });
        }

        return results.sort((a, b) => {
            const scoreDiff = b.matchScore - a.matchScore;
            if (Math.abs(scoreDiff) < 5) {
                return Math.random() - 0.5;
            }
            return scoreDiff;
        });
    }
}
