import { DeleteCompletionUseCase } from "@completion/application/usecases/DeleteCompletionUseCase";
import { GetCompletionsByGameIdUseCase } from "@completion/application/usecases/GetCompletionsByGameIdUseCase";
import { UpsertCompletionUseCase } from "@completion/application/usecases/UpsertCompletionUseCase";
import type { IGameCompletionRepository } from "@completion/domain/repositories/IGameCompletionRepository";
import { MongoGameCompletionRepository } from "@completion/infrastructure/repositories/MongoGameCompletionRepository";
import { CreateGameUseCase } from "@game/application/usecases/CreateGameUseCase";
import { DeleteGameUseCase } from "@game/application/usecases/DeleteGameUseCase";
import { GetGameByIdUseCase } from "@game/application/usecases/GetGameByIdUseCase";
import { GetGamesByPlayerCountUseCase } from "@game/application/usecases/GetGamesByPlayerCountUseCase";
import { GetGamesUseCase } from "@game/application/usecases/GetGamesUseCase";
import { UpdateGameUseCase } from "@game/application/usecases/UpdateGameUseCase";
import type { IGameRepository } from "@game/domain/repositories/IGameRepository";
import { MongoGameRepository } from "@game/infrastructure/repositories/MongoGameRepository";
import { FindCombinationMatchesUseCase } from "@match/application/usecases/FindCombinationMatchesUseCase";
import { FindMatchesUseCase } from "@match/application/usecases/FindMatchesUseCase";
import { GetPlayersUseCase } from "@player/application/usecases/GetPlayersUseCase";
import { UpsertPlayerUseCase } from "@player/application/usecases/UpsertPlayerUseCase";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";
import { MongoPlayerRepository } from "@player/infrastructure/repositories/MongoPlayerRepository";
import { GetCompanyStatsUseCase } from "@stats/application/usecases/GetCompanyStatsUseCase";
import { GetGameCompletionStatsUseCase } from "@stats/application/usecases/GetGameCompletionStatsUseCase";
import { GetPlayerStatsUseCase } from "@stats/application/usecases/GetPlayerStatsUseCase";

// 싱글톤 인스턴스
let gameRepository: IGameRepository | null = null;
let playerRepository: IPlayerRepository | null = null;
let completionRepository: IGameCompletionRepository | null = null;
let findMatchesUseCase: FindMatchesUseCase | null = null;
let findCombinationMatchesUseCase: FindCombinationMatchesUseCase | null = null;
let getPlayerStatsUseCase: GetPlayerStatsUseCase | null = null;
let getGameCompletionStatsUseCase: GetGameCompletionStatsUseCase | null = null;
let getCompanyStatsUseCase: GetCompanyStatsUseCase | null = null;
let getGamesUseCase: GetGamesUseCase | null = null;
let getGameByIdUseCase: GetGameByIdUseCase | null = null;
let createGameUseCase: CreateGameUseCase | null = null;
let updateGameUseCase: UpdateGameUseCase | null = null;
let deleteGameUseCase: DeleteGameUseCase | null = null;
let getGamesByPlayerCountUseCase: GetGamesByPlayerCountUseCase | null = null;
let getPlayersUseCase: GetPlayersUseCase | null = null;
let upsertPlayerUseCase: UpsertPlayerUseCase | null = null;
let upsertCompletionUseCase: UpsertCompletionUseCase | null = null;
let deleteCompletionUseCase: DeleteCompletionUseCase | null = null;
let getCompletionsByGameIdUseCase: GetCompletionsByGameIdUseCase | null = null;

export function getGameRepository(): IGameRepository {
    if (!gameRepository) {
        gameRepository = new MongoGameRepository();
    }
    return gameRepository;
}

export function getPlayerRepository(): IPlayerRepository {
    if (!playerRepository) {
        playerRepository = new MongoPlayerRepository();
    }
    return playerRepository;
}

export function getCompletionRepository(): IGameCompletionRepository {
    if (!completionRepository) {
        completionRepository = new MongoGameCompletionRepository();
    }
    return completionRepository;
}

export function getFindMatchesUseCase(): FindMatchesUseCase {
    if (!findMatchesUseCase) {
        findMatchesUseCase = new FindMatchesUseCase(
            getGameRepository(),
            getCompletionRepository(),
            getPlayerRepository(),
        );
    }
    return findMatchesUseCase;
}

export function getFindCombinationMatchesUseCase(): FindCombinationMatchesUseCase {
    if (!findCombinationMatchesUseCase) {
        findCombinationMatchesUseCase = new FindCombinationMatchesUseCase(
            getGameRepository(),
            getCompletionRepository(),
            getPlayerRepository(),
        );
    }
    return findCombinationMatchesUseCase;
}

export function getGetPlayerStatsUseCase(): GetPlayerStatsUseCase {
    if (!getPlayerStatsUseCase) {
        getPlayerStatsUseCase = new GetPlayerStatsUseCase(
            getPlayerRepository(),
            getGameRepository(),
            getCompletionRepository(),
        );
    }
    return getPlayerStatsUseCase;
}

export function getGetGameCompletionStatsUseCase(): GetGameCompletionStatsUseCase {
    if (!getGameCompletionStatsUseCase) {
        getGameCompletionStatsUseCase = new GetGameCompletionStatsUseCase(
            getPlayerRepository(),
            getGameRepository(),
            getCompletionRepository(),
        );
    }
    return getGameCompletionStatsUseCase;
}

export function getGetCompanyStatsUseCase(): GetCompanyStatsUseCase {
    if (!getCompanyStatsUseCase) {
        getCompanyStatsUseCase = new GetCompanyStatsUseCase(getGameRepository());
    }
    return getCompanyStatsUseCase;
}

// Game UseCases
export function getGetGamesUseCase(): GetGamesUseCase {
    if (!getGamesUseCase) {
        getGamesUseCase = new GetGamesUseCase(getGameRepository());
    }
    return getGamesUseCase;
}

export function getGetGameByIdUseCase(): GetGameByIdUseCase {
    if (!getGameByIdUseCase) {
        getGameByIdUseCase = new GetGameByIdUseCase(getGameRepository());
    }
    return getGameByIdUseCase;
}

export function getCreateGameUseCase(): CreateGameUseCase {
    if (!createGameUseCase) {
        createGameUseCase = new CreateGameUseCase(getGameRepository());
    }
    return createGameUseCase;
}

export function getUpdateGameUseCase(): UpdateGameUseCase {
    if (!updateGameUseCase) {
        updateGameUseCase = new UpdateGameUseCase(getGameRepository());
    }
    return updateGameUseCase;
}

export function getDeleteGameUseCase(): DeleteGameUseCase {
    if (!deleteGameUseCase) {
        deleteGameUseCase = new DeleteGameUseCase(getGameRepository());
    }
    return deleteGameUseCase;
}

export function getGetGamesByPlayerCountUseCase(): GetGamesByPlayerCountUseCase {
    if (!getGamesByPlayerCountUseCase) {
        getGamesByPlayerCountUseCase = new GetGamesByPlayerCountUseCase(getGameRepository());
    }
    return getGamesByPlayerCountUseCase;
}

// Player UseCases
export function getGetPlayersUseCase(): GetPlayersUseCase {
    if (!getPlayersUseCase) {
        getPlayersUseCase = new GetPlayersUseCase(getPlayerRepository());
    }
    return getPlayersUseCase;
}

export function getUpsertPlayerUseCase(): UpsertPlayerUseCase {
    if (!upsertPlayerUseCase) {
        upsertPlayerUseCase = new UpsertPlayerUseCase(getPlayerRepository());
    }
    return upsertPlayerUseCase;
}

// Completion UseCases
export function getUpsertCompletionUseCase(): UpsertCompletionUseCase {
    if (!upsertCompletionUseCase) {
        upsertCompletionUseCase = new UpsertCompletionUseCase(getCompletionRepository());
    }
    return upsertCompletionUseCase;
}

export function getDeleteCompletionUseCase(): DeleteCompletionUseCase {
    if (!deleteCompletionUseCase) {
        deleteCompletionUseCase = new DeleteCompletionUseCase(getCompletionRepository());
    }
    return deleteCompletionUseCase;
}

export function getGetCompletionsByGameIdUseCase(): GetCompletionsByGameIdUseCase {
    if (!getCompletionsByGameIdUseCase) {
        getCompletionsByGameIdUseCase = new GetCompletionsByGameIdUseCase(getCompletionRepository());
    }
    return getCompletionsByGameIdUseCase;
}
