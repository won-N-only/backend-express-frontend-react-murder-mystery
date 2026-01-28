import type { CompanyStat, IGameRepository } from "@game/domain/repositories/IGameRepository";

export class GetCompanyStatsUseCase {
    constructor(private gameRepository: IGameRepository) { }

    async execute(): Promise<CompanyStat[]> {
        return this.gameRepository.getCompanyStats();
    }
}
