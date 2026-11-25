import { describe, expect, it } from "vitest";
import { findClosestDate } from "../index.js";

describe("findClosestDate", () => {
    it("picks the earlier candidate when the distances match", () => {
        expect(
            findClosestDate("2024-01-01T12:00:00Z", [
                "2024-01-01T00:00:00Z",
                "2024-01-02T00:00:00Z",
            ])?.toISOString(),
        ).toBe("2024-01-01T00:00:00.000Z");
        expect(findClosestDate("2024-01-01T00:00:00Z", [])).toBeUndefined();
    });
});
