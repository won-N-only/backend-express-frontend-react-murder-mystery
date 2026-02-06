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

        // 1. 모든 게임 목록을 가져옵니다. (여기서는 페이지네이션 없이 모든 게임을 가져온다고 가정)
        //    나중에 이 부분에 페이지네이션을 추가할 수 있습니다.
        const allGames = await this.gameRepository.findAll();

        // 2. 선택된 플레이어들이 완료한 게임 정보를 가져옵니다.
        const playerCompletions = await this.completionRepository.findByGameIdsAndPlayerIds(
            allGames.map(game => game.id!.toString()), // 모든 게임 ID를 전달
            playerIds,
            CompletionStatus.DONE // 완료된 게임만 필터링
        );

        // 플레이어별 완료 게임을 빠르게 찾기 위한 맵 생성
        const completedMap = new Map<string, Set<string>>(); // gameId -> set of playerIds
        playerCompletions.forEach(completion => {
            if (!completedMap.has(completion.gameId.toString())) {
                completedMap.set(completion.gameId.toString(), new Set());
            }
            completedMap.get(completion.gameId.toString())!.add(completion.playerId.toString());
        });

        // 3. 플레이 가능한 게임을 필터링합니다.
        const playableGames = allGames.filter(game => {
            // 최소/최대 플레이어 수 조건
            if (game.minPlayers > playerIds.length) {
                return false;
            }
            if (game.maxPlayers && game.maxPlayers < playerIds.length) {
                return false;
            }

            // 선택된 플레이어 중 한 명이라도 해당 게임을 완료했다면 플레이 불가능
            const playersWhoCompletedGame = completedMap.get(game.id!.toString());
            if (playersWhoCompletedGame) {
                const anySelectedPlayerCompleted = playerIds.some(pId => playersWhoCompletedGame.has(pId));
                if (anySelectedPlayerCompleted) {
                    return false; // 한 명이라도 완료했으면 플레이할 수 없음
                }
            }

            return true;
        });

        return playableGames;
    }
}
