import { describe, expect, it } from "vitest";
import { removeDuplicateDates } from "../index.js";

describe("removeDuplicateDates", () => {
    it("keeps the first date of each day in order", () => {
        const dates = [
            "2024-06-15T01:00:00Z",
            "2024-06-15T20:00:00Z",
            "2024-06-16T00:00:00Z",
        ];
        const unique = removeDuplicateDates({
            dates,
            unit: "day",
            timeZone: "UTC",
        });
        expect(unique?.map((date) => date.toISOString())).toEqual([
            "2024-06-15T01:00:00.000Z",
            "2024-06-16T00:00:00.000Z",
        ]);
        expect(dates)?.toHaveLength(3);
    });
});
