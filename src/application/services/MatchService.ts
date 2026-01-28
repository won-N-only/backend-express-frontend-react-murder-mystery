import type { Game } from "../../domain/entities/Game";
import type { IGameCompletionRepository } from "../../domain/repositories/IGameCompletionRepository";
import type { IGameRepository } from "../../domain/repositories/IGameRepository";
import type { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { CompletionStatus } from "../../domain/valueObjects/CompletionStatus";

export interface MatchOptions {
    playerIds: string[];
    playerCount: number;
    excludePartySeries?: boolean;
    excludeSinglePlayer?: boolean;
}

export interface MatchResult {
    game: Game;
    matchScore: number;
    incompletePlayers: string[];
}

export interface CombinationMatchOptions {
    playerIds: string[];
    excludePartySeries?: boolean;
    excludeSinglePlayer?: boolean;
}

export interface GameGroup {
    game: Game;
    assignedPlayers: string[];
    playerNames: string[];
    matchScore: number;
    allIncomplete: boolean;
}

export interface CombinationMatchResult {
    groups: GameGroup[];
    totalScore: number;
    unusedPlayers: string[];
}

export class MatchService {
    constructor(
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
        private playerRepository: IPlayerRepository,
    ) { }

    async findMatches(options: MatchOptions): Promise<MatchResult[]> {
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

        const results: MatchResult[] = [];

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

    async findCombinationMatches(options: CombinationMatchOptions): Promise<CombinationMatchResult[]> {
        const { playerIds, excludePartySeries = false, excludeSinglePlayer = false } = options;

        if (playerIds.length < 2) return [];

        // 모든 게임 조회
        let games = await this.gameRepository.findAll();

        // 필터링
        games = games.filter((game) => {
            if (excludePartySeries && game.isPartySeries()) return false;
            if (excludeSinglePlayer && game.isSinglePlayer()) return false;
            return true;
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
        for (const c of completions) {
            const gameIdStr = c.gameId.toString();
            const playerIdStr = c.playerId.toString();
            if (!gameCompletionMap.has(gameIdStr)) {
                gameCompletionMap.set(gameIdStr, new Map());
            }
            gameCompletionMap.get(gameIdStr)!.set(playerIdStr, c.status);
        }

        const combinations: CombinationMatchResult[] = [];
        const n = playerIds.length;
        const maxGroups = Math.min(4, n);
        const minGroups = 2;

        // 2~4개 그룹으로 나누기
        for (let numGroups = minGroups; numGroups <= maxGroups; numGroups++) {
            if (combinations.length >= 100) break;

            const attempts = numGroups === 2 ? 50 : numGroups === 3 ? 40 : 30;
            for (let attempt = 0; attempt < attempts; attempt++) {
                if (combinations.length >= 100) break;

                // 매 시도마다 랜덤 셔플 (다양성 확보)
                const shuffled = this.shuffleArray([...playerIds]);
                const groups = this.partitionPlayers(shuffled, numGroups);
                const gameGroups: GameGroup[] = [];
                let allValid = true;

                for (const group of groups) {
                    if (group.length === 0) {
                        allValid = false;
                        break;
                    }

                    const gameGroup = this.findBestGameForGroup(
                        group,
                        games,
                        gameCompletionMap,
                        playerNameMap,
                    );
                    if (!gameGroup) {
                        allValid = false;
                        break;
                    }
                    gameGroups.push(gameGroup);
                }

                if (allValid && gameGroups.length === numGroups) {
                    const gameIds = new Set(gameGroups.map((g) => g.game.id!.toString()));
                    if (gameIds.size === gameGroups.length) {
                        const totalScore = gameGroups.reduce((sum, g) => sum + g.matchScore, 0);
                        combinations.push({
                            groups: gameGroups,
                            totalScore,
                            unusedPlayers: [],
                        });
                    }
                }
            }
        }

        // 정렬 및 중복 제거
        combinations.sort((a, b) => {
            const scoreDiff = b.totalScore - a.totalScore;
            if (Math.abs(scoreDiff) < 5) {
                return Math.random() - 0.5;
            }
            return scoreDiff;
        });

        const seen = new Set<string>();
        const uniqueCombinations: CombinationMatchResult[] = [];

        for (const combo of combinations) {
            const gamePair = combo.groups
                .map((g) => g.game.id!.toString())
                .sort()
                .join("|");

            if (!seen.has(gamePair)) {
                seen.add(gamePair);
                uniqueCombinations.push(combo);
                if (uniqueCombinations.length >= 10) break;
            }
        }

        return uniqueCombinations.sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
    }

    private partitionPlayers(players: string[], numGroups: number): string[][] {
        if (numGroups === 1) return [players];
        if (numGroups === players.length) return players.map((p) => [p]);

        const groups: string[][] = Array(numGroups)
            .fill(null)
            .map(() => []);
        const groupSizes: number[] = [];

        let remaining = players.length;
        for (let i = 0; i < numGroups - 1; i++) {
            const minSize = 1;
            const maxSize = remaining - (numGroups - i - 1);
            const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
            groupSizes.push(size);
            remaining -= size;
        }
        groupSizes.push(remaining);

        for (let i = groupSizes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [groupSizes[i], groupSizes[j]] = [groupSizes[j], groupSizes[i]];
        }

        let playerIndex = 0;
        for (let i = 0; i < numGroups; i++) {
            for (let j = 0; j < groupSizes[i]; j++) {
                groups[i].push(players[playerIndex++]);
            }
        }

        return groups;
    }

    private findBestGameForGroup(
        playerGroup: string[],
        games: Game[],
        gameCompletionMap: Map<string, Map<string, CompletionStatus>>,
        playerNameMap: Map<string, string>,
    ): GameGroup | null {
        const groupSize = playerGroup.length;
        let bestCandidate: { game: Game; score: number; allIncomplete: boolean } | null = null;
        const topCandidates: Array<{ game: Game; score: number; allIncomplete: boolean }> = [];
        let bestScore = -1;
        let bestAllIncomplete = false;

        // 한 번의 순회로 최적 게임 찾기 (정렬 최소화)
        for (const game of games) {
            if (!game.canAccommodatePlayers(groupSize)) continue;

            const gameIdStr = game.id!.toString();
            const statusMap = gameCompletionMap.get(gameIdStr) || new Map();

            let completedCount = 0;
            let allIncomplete = true;

            // 플레이어 그룹의 완료 상태 확인
            for (const pid of playerGroup) {
                const status = statusMap.get(pid);
                if (status === CompletionStatus.DONE) {
                    completedCount++;
                    allIncomplete = false;
                    break; // 하나라도 완료하면 바로 중단
                }
            }

            if (completedCount > 0) continue;

            const completionRate = completedCount / groupSize;
            const score = allIncomplete ? 1000 + (1 - completionRate) * 100 : (1 - completionRate) * 100;

            // 최고 점수 후보 추적
            if (
                score > bestScore ||
                (allIncomplete && !bestAllIncomplete) ||
                (allIncomplete === bestAllIncomplete && Math.abs(score - bestScore) < 5)
            ) {
                if (allIncomplete && !bestAllIncomplete) {
                    // 모두 미완료가 더 우선순위가 높음
                    bestScore = score;
                    bestAllIncomplete = true;
                    topCandidates.length = 0;
                    topCandidates.push({ game, score, allIncomplete });
                } else if (allIncomplete === bestAllIncomplete) {
                    if (score > bestScore) {
                        bestScore = score;
                        topCandidates.length = 0;
                        topCandidates.push({ game, score, allIncomplete });
                    } else if (Math.abs(score - bestScore) < 5) {
                        topCandidates.push({ game, score, allIncomplete });
                    }
                } else if (score > bestScore) {
                    bestScore = score;
                    bestAllIncomplete = allIncomplete;
                    topCandidates.length = 0;
                    topCandidates.push({ game, score, allIncomplete });
                }
            }
        }

        if (topCandidates.length === 0) return null;

        // 랜덤 선택
        const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        const playerNames = playerGroup.map((pid) => playerNameMap.get(pid) || pid);

        return {
            game: selected.game,
            assignedPlayers: playerGroup,
            playerNames,
            matchScore: selected.score,
            allIncomplete: selected.allIncomplete,
        };
    }

    /**
     * 배열을 랜덤하게 셔플 (Fisher-Yates 알고리즘)
     */
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
