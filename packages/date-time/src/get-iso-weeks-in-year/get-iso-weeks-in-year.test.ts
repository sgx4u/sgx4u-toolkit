import { describe, expect, it } from "vitest";
import { getIsoWeeksInYear } from "../index.js";

describe("getIsoWeeksInYear", () => {
    it("returns 53 for 2020 and for 2026, which starts on a Thursday", () => {
        expect(getIsoWeeksInYear(2020)).toBe(53);
        expect(getIsoWeeksInYear(2026)).toBe(53);
        expect(getIsoWeeksInYear(2021)).toBe(52);
        expect(getIsoWeeksInYear(2019)).toBe(52);
    });

    it("throws when the year is not an integer", () => {
        expect(() => getIsoWeeksInYear(2020.5)).toThrow(RangeError);
        expect(() => getIsoWeeksInYear(2020.5)).toThrow(
            "`year` must be an integer",
        );
        expect(() => getIsoWeeksInYear("2020" as never)).toThrow(TypeError);
        expect(() => getIsoWeeksInYear("2020" as never)).toThrow(
            "`year` must be a number",
        );
        expect(() => getIsoWeeksInYear(Number.NaN)).toThrow(RangeError);
        expect(() => getIsoWeeksInYear(Number.NaN)).toThrow("finite number");
    });
});
