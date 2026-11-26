import { describe, expect, it } from "vitest";
import { getLatestDate } from "../index.js";

describe("getLatestDate", () => {
    it("returns the latest instant", () => {
        expect(
            getLatestDate({
                dates: ["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"],
            })?.toISOString(),
        ).toBe("2024-01-02T00:00:00.000Z");
        expect(getLatestDate({ dates: [] })).toBeUndefined();
    });

    it("throws when dates is not an array", () => {
        expect(() => getLatestDate({ dates: null as never })).toThrow(
            TypeError,
        );
    });

    it("throws when an entry is not a real date", () => {
        expect(() => getLatestDate({ dates: ["nope"] })).toThrow(RangeError);
    });
});