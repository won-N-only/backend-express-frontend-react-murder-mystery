import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { Game } from "@game/domain/entities/Game";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";

export interface FindCombinationMatchesRequest {
    playerIds: string[];
    excludePartySeries?: boolean;
    excludeSinglePlayer?: boolean;
}

export interface GameGroup {
    game: Game;
    assignedPlayers: string[];
    playerNames: string[];
    allIncomplete: boolean;
}

export interface FindCombinationMatchesResult {
    groups: GameGroup[];
    unusedPlayers: string[];
}

export class FindCombinationMatchesUseCase {
    constructor(
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
        private playerRepository: IPlayerRepository,
    ) { }

    async execute(options: FindCombinationMatchesRequest): Promise<FindCombinationMatchesResult[]> {
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

        const combinations: FindCombinationMatchesResult[] = [];
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
                        combinations.push({
                            groups: gameGroups,
                            unusedPlayers: [],
                        });
                    }
                }
            }
        }

        // 중복 제거
        const seen = new Set<string>();
        const uniqueCombinations: FindCombinationMatchesResult[] = [];

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

        // 랜덤 정렬
        return uniqueCombinations.sort(() => Math.random() - 0.5).slice(0, 10);
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
        const topCandidates: Game[] = [];

        // 한 번의 순회로 최적 게임 찾기 (정렬 최소화)
        for (const game of games) {
            if (!game.canAccommodatePlayers(groupSize)) continue;

            const gameIdStr = game.id!.toString();
            const statusMap = gameCompletionMap.get(gameIdStr) || new Map();

            // 플레이어 그룹의 완료 상태 확인 (조기 종료)
            let allIncomplete = true;
            for (const pid of playerGroup) {
                if (statusMap.get(pid) === CompletionStatus.DONE) {
                    allIncomplete = false;
                    break; // 하나라도 완료하면 바로 중단
                }
            }

            // 모두 미완료인 게임만 후보에 추가
            if (allIncomplete) {
                topCandidates.push(game);
            }
        }

        if (topCandidates.length === 0) return null;

        // 랜덤 선택
        const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        const playerNames = playerGroup.map((pid) => playerNameMap.get(pid) || pid);

        return {
            game: selected,
            assignedPlayers: playerGroup,
            playerNames,
            allIncomplete: true,
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
