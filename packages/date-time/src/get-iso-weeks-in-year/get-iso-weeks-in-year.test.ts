import { describe, expect, it } from "vitest";
import { getISOWeeksInYear } from "../index.js";

describe("getISOWeeksInYear", () => {
    it("returns 53 for 2020 and for 2026, which starts on a Thursday", () => {
        expect(getISOWeeksInYear(2020)).toBe(53);
        expect(getISOWeeksInYear(2026)).toBe(53);
        expect(getISOWeeksInYear(2021)).toBe(52);
        expect(getISOWeeksInYear(2019)).toBe(52);
    });

    it("returns undefined when the year is not an integer", () => {
        expect(getISOWeeksInYear(2020.5)).toBeUndefined();
        expect(getISOWeeksInYear("2020" as never)).toBeUndefined();
        expect(getISOWeeksInYear(Number.NaN)).toBeUndefined();
    });
});