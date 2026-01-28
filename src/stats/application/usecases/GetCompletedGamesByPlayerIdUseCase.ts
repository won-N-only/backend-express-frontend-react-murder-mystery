import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";

export interface CompletedGame {
    gameId: string;
    gameName: string;
    orderNumber: number;
    completedAt: Date | null;
}

export class GetCompletedGamesByPlayerIdUseCase {
    constructor(
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
    ) { }

    async execute(playerId: string): Promise<CompletedGame[]> {
        // 플레이어의 모든 완료 상태 조회
        const completions = await this.completionRepository.findByPlayerId(playerId);

        // 완료된 게임만 필터링
        const completedCompletions = completions.filter(
            (c) => c.status === CompletionStatus.DONE,
        );

        if (completedCompletions.length === 0) return [];

        // 게임 ID 추출 및 중복 제거
        const gameIds = Array.from(
            new Set(completedCompletions.map((c) => c.gameId.toString())),
        );

        // 필요한 게임만 병렬로 조회
        const games = await Promise.all(
            gameIds.map((id) => this.gameRepository.findById(id)),
        );
        const gameMap = new Map(
            games
                .filter((g): g is NonNullable<typeof g> => g !== null)
                .map((g) => [g.id!.toString(), g]),
        );

        // 완료된 게임 정보 매핑
        const completedGames: CompletedGame[] = completedCompletions
            .map((c) => {
                const game = gameMap.get(c.gameId.toString());
                if (!game) return null;
                return {
                    gameId: c.gameId.toString(),
                    gameName: game.name,
                    orderNumber: game.orderNumber,
                    completedAt: c.completedAt,
                };
            })
            .filter((g): g is CompletedGame => g !== null)
            .sort((a, b) => a.orderNumber - b.orderNumber);

        return completedGames;
    }
}
