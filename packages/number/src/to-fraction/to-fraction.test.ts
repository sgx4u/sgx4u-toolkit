import { describe, expect, it } from "vitest";
import { toFraction } from "../index.js";

describe("toFraction", () => {
    it("covers the documented behavior", () => {
        expect(toFraction({ value: 0.5 })).toEqual({
            numerator: 1,
            denominator: 2,
        });
        expect(toFraction({ value: 1 / 3, maximumDenominator: 10 })).toEqual({
            numerator: 1,
            denominator: 3,
        });
        expect(toFraction({ value: 0 })).toEqual({
            numerator: 0,
            denominator: 1,
        });
        expect(toFraction({ value: Number.NaN })).toBeUndefined();
    });
});
