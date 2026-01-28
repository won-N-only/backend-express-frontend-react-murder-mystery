import { MatchService } from "../../application/services/MatchService";
import { StatsService } from "../../application/services/StatsService";
import type { IGameCompletionRepository } from "../../domain/repositories/IGameCompletionRepository";
import type { IGameRepository } from "../../domain/repositories/IGameRepository";
import type { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { MongoGameCompletionRepository } from "../repositories/MongoGameCompletionRepository";
import { MongoGameRepository } from "../repositories/MongoGameRepository";
import { MongoPlayerRepository } from "../repositories/MongoPlayerRepository";

// 싱글톤 인스턴스
let gameRepository: IGameRepository | null = null;
let playerRepository: IPlayerRepository | null = null;
let completionRepository: IGameCompletionRepository | null = null;
let matchService: MatchService | null = null;
let statsService: StatsService | null = null;

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

export function getMatchService(): MatchService {
    if (!matchService) {
        matchService = new MatchService(
            getGameRepository(),
            getCompletionRepository(),
            getPlayerRepository(),
        );
    }
    return matchService;
}

export function getStatsService(): StatsService {
    if (!statsService) {
        statsService = new StatsService();
    }
    return statsService;
}
