import type { IPlayerRepository } from "@player/domain/repositories/IPlayerRepository";

export class UpsertPlayerUseCase {
    constructor(private playerRepository: IPlayerRepository) { }

    async execute(name: string): Promise<ReturnType<IPlayerRepository["upsert"]>> {
        return this.playerRepository.upsert(name);
    }
}
