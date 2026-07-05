import { CreateCommentUseCase } from "@comment/application/usecases/CreateCommentUseCase";
import { DeleteCommentUseCase } from "@comment/application/usecases/DeleteCommentUseCase";
import { GetCommentsByGameIdUseCase } from "@comment/application/usecases/GetCommentsByGameIdUseCase";
import type { ICommentRepository } from "@comment/domain/repositories/ICommentRepository";
import { MongoCommentRepository } from "@comment/infrastructure/repositories/MongoCommentRepository";
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
import { GetPlayableGamesByPlayersUseCase } from "@match/application/usecases/GetPlayableGamesByPlayersUseCase";
import { GetPlayersUseCase } from "@player/application/usecases/GetPlayersUseCase";
import { UpsertPlayerUseCase } from "@player/application/usecases/UpsertPlayerUseCase";
import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";
import { MongoPlayerRepository } from "@player/infrastructure/repositories/MongoPlayerRepository";
import { GetCompanyStatsUseCase } from "@stats/application/usecases/GetCompanyStatsUseCase";
import { GetCompletedGamesByPlayerIdUseCase } from "@stats/application/usecases/GetCompletedGamesByPlayerIdUseCase";
import { GetGameCompletionStatsUseCase } from "@stats/application/usecases/GetGameCompletionStatsUseCase";
import { GetPlayerStatsUseCase } from "@stats/application/usecases/GetPlayerStatsUseCase";
import { RebuildStatSnapshotsUseCase } from "@stats/application/usecases/RebuildStatSnapshotsUseCase";
import { SyncStatSnapshotUseCase } from "@stats/application/usecases/SyncStatSnapshotUseCase";
import type { IStatSnapshotRepository } from "@stats/application/ports/IStatSnapshotRepository";
import { MongoStatSnapshotRepository } from "@stats/infrastructure/repositories/MongoStatSnapshotRepository";
import type { IEventBus } from "@shared/domain/events/IEventBus";
import { InProcessEventBus } from "@shared/infrastructure/events/InProcessEventBus";

// 싱글톤 인스턴스
let eventBus: IEventBus | null = null;
let gameRepository: IGameRepository | null = null;
let playerRepository: IPlayerRepository | null = null;
let completionRepository: IGameCompletionRepository | null = null;
let findMatchesUseCase: FindMatchesUseCase | null = null;
let findCombinationMatchesUseCase: FindCombinationMatchesUseCase | null = null;
let getPlayableGamesByPlayersUseCase: GetPlayableGamesByPlayersUseCase | null = null;
let getPlayerStatsUseCase: GetPlayerStatsUseCase | null = null;
let getGameCompletionStatsUseCase: GetGameCompletionStatsUseCase | null = null;
let getCompanyStatsUseCase: GetCompanyStatsUseCase | null = null;
let getCompletedGamesByPlayerIdUseCase: GetCompletedGamesByPlayerIdUseCase | null = null;
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
let commentRepository: ICommentRepository | null = null;
let createCommentUseCase: CreateCommentUseCase | null = null;
let getCommentsByGameIdUseCase: GetCommentsByGameIdUseCase | null = null;
let deleteCommentUseCase: DeleteCommentUseCase | null = null;
let statSnapshotRepository: IStatSnapshotRepository | null = null;
let syncStatSnapshotUseCase: SyncStatSnapshotUseCase | null = null;
let rebuildStatSnapshotsUseCase: RebuildStatSnapshotsUseCase | null = null;

export function getEventBus(): IEventBus {
    if (!eventBus) {
        eventBus = new InProcessEventBus();
    }
    return eventBus;
}

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

export function resolvePlayableGamesByPlayersUseCase(): GetPlayableGamesByPlayersUseCase {
    if (!getPlayableGamesByPlayersUseCase) {
        getPlayableGamesByPlayersUseCase = new GetPlayableGamesByPlayersUseCase(
            getGameRepository(),
            getCompletionRepository(),
        );
    }
    return getPlayableGamesByPlayersUseCase;
}

export function getStatSnapshotRepository(): IStatSnapshotRepository {
    if (!statSnapshotRepository) {
        statSnapshotRepository = new MongoStatSnapshotRepository();
    }
    return statSnapshotRepository;
}

export function resolveSyncStatSnapshotUseCase(): SyncStatSnapshotUseCase {
    if (!syncStatSnapshotUseCase) {
        syncStatSnapshotUseCase = new SyncStatSnapshotUseCase(getStatSnapshotRepository());
    }
    return syncStatSnapshotUseCase;
}

export function resolveRebuildStatSnapshotsUseCase(): RebuildStatSnapshotsUseCase {
    if (!rebuildStatSnapshotsUseCase) {
        rebuildStatSnapshotsUseCase = new RebuildStatSnapshotsUseCase(
            getGameRepository(),
            getPlayerRepository(),
            getCompletionRepository(),
            getStatSnapshotRepository(),
        );
    }
    return rebuildStatSnapshotsUseCase;
}

export function resolvePlayerStatsUseCase(): GetPlayerStatsUseCase {
    if (!getPlayerStatsUseCase) {
        getPlayerStatsUseCase = new GetPlayerStatsUseCase(
            getPlayerRepository(),
            getGameRepository(),
            getStatSnapshotRepository(),
        );
    }
    return getPlayerStatsUseCase;
}

export function resolveGameCompletionStatsUseCase(): GetGameCompletionStatsUseCase {
    if (!getGameCompletionStatsUseCase) {
        getGameCompletionStatsUseCase = new GetGameCompletionStatsUseCase(
            getPlayerRepository(),
            getGameRepository(),
            getStatSnapshotRepository(),
        );
    }
    return getGameCompletionStatsUseCase;
}

export function resolveCompanyStatsUseCase(): GetCompanyStatsUseCase {
    if (!getCompanyStatsUseCase) {
        getCompanyStatsUseCase = new GetCompanyStatsUseCase(getGameRepository());
    }
    return getCompanyStatsUseCase;
}

export function resolveCompletedGamesByPlayerIdUseCase(): GetCompletedGamesByPlayerIdUseCase {
    if (!getCompletedGamesByPlayerIdUseCase) {
        getCompletedGamesByPlayerIdUseCase = new GetCompletedGamesByPlayerIdUseCase(
            getGameRepository(),
            getCompletionRepository(),
        );
    }
    return getCompletedGamesByPlayerIdUseCase;
}

// Game UseCases
export function resolveGamesUseCase(): GetGamesUseCase {
    if (!getGamesUseCase) {
        getGamesUseCase = new GetGamesUseCase(getGameRepository());
    }
    return getGamesUseCase;
}

export function resolveGameByIdUseCase(): GetGameByIdUseCase {
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

export function resolveGamesByPlayerCountUseCase(): GetGamesByPlayerCountUseCase {
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
        upsertCompletionUseCase = new UpsertCompletionUseCase(getCompletionRepository(), getEventBus());
    }
    return upsertCompletionUseCase;
}

export function getDeleteCompletionUseCase(): DeleteCompletionUseCase {
    if (!deleteCompletionUseCase) {
        deleteCompletionUseCase = new DeleteCompletionUseCase(getCompletionRepository(), getEventBus());
    }
    return deleteCompletionUseCase;
}

export function getGetCompletionsByGameIdUseCase(): GetCompletionsByGameIdUseCase {
    if (!getCompletionsByGameIdUseCase) {
        getCompletionsByGameIdUseCase = new GetCompletionsByGameIdUseCase(getCompletionRepository());
    }
    return getCompletionsByGameIdUseCase;
}

// Comment
export function getCommentRepository(): ICommentRepository {
    if (!commentRepository) {
        commentRepository = new MongoCommentRepository();
    }
    return commentRepository;
}

export function getCreateCommentUseCase(): CreateCommentUseCase {
    if (!createCommentUseCase) {
        createCommentUseCase = new CreateCommentUseCase(getCommentRepository());
    }
    return createCommentUseCase;
}

export function resolveCommentsByGameIdUseCase(): GetCommentsByGameIdUseCase {
    if (!getCommentsByGameIdUseCase) {
        getCommentsByGameIdUseCase = new GetCommentsByGameIdUseCase(getCommentRepository());
    }
    return getCommentsByGameIdUseCase;
}

export function getDeleteCommentUseCase(): DeleteCommentUseCase {
    if (!deleteCommentUseCase) {
        deleteCommentUseCase = new DeleteCommentUseCase(getCommentRepository());
    }
    return deleteCommentUseCase;
}
