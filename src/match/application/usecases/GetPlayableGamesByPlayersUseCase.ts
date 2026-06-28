import { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { CompletionStatus } from "@completion/domain/valueObjects/CompletionStatus";
import { Game } from "@game/domain/entities/Game";
import { IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetPlayableGamesByPlayersUseCase {
    constructor(
        private gameRepository: IGameRepository,
        private completionRepository: IGameCompletionRepository,
    ) { }

    async execute(playerIds: string[]): Promise<Game[]> {
        if (playerIds.length === 0) {
            return [];
        }

        // DB 레벨에서 플레이어 수에 맞는 게임만 조회 (minPlayers <= count <= maxPlayers)
        const eligibleGames = await this.gameRepository.findByPlayerCount(playerIds.length);

        const playerCompletions = await this.completionRepository.findByGameIdsAndPlayerIds(
            eligibleGames.map((game) => game.id!.toString()),
            playerIds,
            CompletionStatus.DONE,
        );

        // gameId → 완료한 플레이어 id Set
        const completedMap = new Map<string, Set<string>>();
        for (const completion of playerCompletions) {
            const gameIdStr = completion.gameId.toString();
            if (!completedMap.has(gameIdStr)) {
                completedMap.set(gameIdStr, new Set());
            }
            completedMap.get(gameIdStr)!.add(completion.playerId.toString());
        }

        return eligibleGames.filter((game) => {
            const completedBy = completedMap.get(game.id!.toString());
            if (!completedBy) return true;
            return !playerIds.some((pId) => completedBy.has(pId));
        });
    }
}
