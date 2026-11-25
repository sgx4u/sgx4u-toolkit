import { describe, expect, it } from "vitest";
import { clampDate } from "../index.js";

describe("clampDate", () => {
    it("limits a date and rejects an inverted range", () => {
        expect(
            clampDate("2024-01-10T00:00:00Z", {
                start: "2024-01-01T00:00:00Z",
                end: "2024-01-05T00:00:00Z",
            }).toISOString(),
        ).toBe("2024-01-05T00:00:00.000Z");
        expect(() =>
            clampDate("2024-01-03T00:00:00Z", {
                start: "2024-01-05T00:00:00Z",
                end: "2024-01-01T00:00:00Z",
            }),
        ).toThrow(RangeError);
    });
});
