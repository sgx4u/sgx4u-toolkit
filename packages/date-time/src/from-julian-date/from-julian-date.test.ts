import { describe, expect, it } from "vitest";
import { fromJulianDate } from "../index.js";

describe("fromJulianDate", () => {
    it("converts the Unix epoch and a fractional day", () => {
        expect(fromJulianDate(2_440_587.5)?.toISOString()).toBe(
            "1970-01-01T00:00:00.000Z",
        );
        expect(fromJulianDate(2_440_589)?.toISOString()).toBe(
            "1970-01-02T12:00:00.000Z",
        );
    });

    it("converts the leap day 2024-02-29", () => {
        expect(fromJulianDate(2_460_369.5)?.toISOString()).toBe(
            "2024-02-29T00:00:00.000Z",
        );
    });

    it("returns undefined when the value is not usable", () => {
        expect(fromJulianDate("1" as never)).toBeUndefined();
        expect(fromJulianDate(Number.NaN)).toBeUndefined();
        expect(fromJulianDate(1e20)).toBeUndefined();
    });
});