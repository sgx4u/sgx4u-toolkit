import { describe, expect, it } from "vitest";
import { getEarliestDate } from "../index.js";

describe("getEarliestDate", () => {
    it("returns undefined for an empty list and does not reorder the input", () => {
        const dates = ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"];
        expect(getEarliestDate({ dates: [] })).toBeUndefined();
        expect(getEarliestDate({ dates })?.toISOString()).toBe(
            "2024-01-01T00:00:00.000Z",
        );
        expect(dates[0]).toBe("2024-01-02T00:00:00Z");
    });

    it("throws when dates is not an array", () => {
        expect(() => getEarliestDate({ dates: null as never })).toThrow(
            TypeError,
        );
    });

    it("throws when an entry is not a real date", () => {
        expect(() => getEarliestDate({ dates: ["nope"] })).toThrow(RangeError);
    });
});