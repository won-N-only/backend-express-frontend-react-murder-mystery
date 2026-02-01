import type { ObjectId } from "mongodb";

export class Game {
    constructor(
        public readonly id: ObjectId | undefined,
        public readonly orderNumber: number,
        public readonly name: string,
        public readonly minPlayers: number,
        public readonly maxPlayers: number | null,
        public readonly company: string | null,
        public readonly series: string | null,
        public readonly ownerNote: string | null,
        public readonly thumbnail: string | null,
        public readonly description: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    /**
     * 정규화된 최소 플레이어 수 (maxPlayers가 있으면 maxPlayers 값으로 설정)
     */
    get normalizedMinPlayers(): number {
        return this.maxPlayers != null ? this.maxPlayers : this.minPlayers;
    }

    /**
     * 플레이어 수가 게임 인원 범위에 맞는지 확인
     */
    canAccommodatePlayers(playerCount: number): boolean {
        if (playerCount < this.normalizedMinPlayers) {
            return false;
        }
        if (this.maxPlayers != null && playerCount > this.maxPlayers) {
            return false;
        }
        return true;
    }

    /**
     * 1인용 게임인지 확인
     */
    isSinglePlayer(): boolean {
        return this.maxPlayers === 1;
    }

    /**
     * 2인용 게임인지 확인
     */
    isTwoPlayer(): boolean {
        return this.maxPlayers === 2;
    }

    /**
     * 파티 시리즈인지 확인
     */
    isPartySeries(): boolean {
        return this.series === "미스터리 파티 시리즈";
    }
}
