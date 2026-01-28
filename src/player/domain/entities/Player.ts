import type { ObjectId } from "mongodb";

export class Player {
    constructor(
        public readonly id: ObjectId | undefined,
        public readonly name: string,
        public readonly lastUpdated: Date | null,
        public readonly createdAt: Date,
    ) { }
}
