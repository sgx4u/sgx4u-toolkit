import { describe, expect, it } from "vitest";
import { isBetween } from "../index.js";

describe("isBetween", () => {
    it("includes both ends unless an option says otherwise", () => {
        expect(
            isBetween(
                "2024-01-01T00:00:00Z",
                "2024-01-01T00:00:00Z",
                "2024-01-02T00:00:00Z",
            ),
        ).toBe(true);
        expect(
            isBetween(
                "2024-01-01T00:00:00Z",
                "2024-01-01T00:00:00Z",
                "2024-01-02T00:00:00Z",
                { includeStart: false },
            ),
        ).toBe(false);
        expect(
            isBetween(
                "2024-01-03T00:00:00Z",
                "2024-01-02T00:00:00Z",
                "2024-01-01T00:00:00Z",
            ),
        ).toBe(false);
    });
});
