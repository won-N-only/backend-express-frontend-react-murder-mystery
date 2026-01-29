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
        // DB 레벨에서 완료된 게임만 조회 (인덱스 최적화)
        const completedCompletions = await this.completionRepository.findByPlayerId(
            playerId,
            CompletionStatus.DONE,
        );

        if (completedCompletions.length === 0) return [];

        // 게임 ID 추출 및 중복 제거
        const gameIds = Array.from(
            new Set(completedCompletions.map((c) => c.gameId.toString())),
        );

        // 배치 조회로 성능 개선
        const games = await this.gameRepository.findByIds(gameIds);
        const gameMap = new Map(
            games.map((g) => [g.id!.toString(), g]),
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
