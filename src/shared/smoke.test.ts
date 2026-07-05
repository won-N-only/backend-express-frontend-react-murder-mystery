import { describe, expect, it } from "vitest";

describe("vitest infra", () => {
    it("runs with tsconfig path aliases", async () => {
        const { CompletionStatus } = await import("@completion/domain/valueObjects/CompletionStatus");
        expect(CompletionStatus.DONE).toBe(1);
    });
});
