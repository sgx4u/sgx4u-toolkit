import { describe, expect, it } from "vitest";
import {
    addDecimal,
    divideDecimal,
    multiplyDecimal,
    subtractDecimal,
} from "./decimal-arithmetic.utils.js";
import { sumExact } from "./exact-sum.utils.js";
import { roundDecimal } from "./round-decimal.utils.js";

describe("numeric engines", () => {
    it("rounds ties and negative precision", () => {
        expect(roundDecimal(1.5, 0, "halfExpand")).toBe(2);
        expect(roundDecimal(2.5, 0, "halfEven")).toBe(2);
        expect(roundDecimal(1.5, 0, "halfEven")).toBe(2);
        expect(roundDecimal(-1.5, 0, "halfExpand")).toBe(-2);
        expect(roundDecimal(-1.5, 0, "halfTrunc")).toBe(-1);
        expect(roundDecimal(-1.5, 0, "halfCeil")).toBe(-1);
        expect(roundDecimal(-1.5, 0, "halfFloor")).toBe(-2);
        expect(roundDecimal(-1.2, 0, "floor")).toBe(-2);
        expect(roundDecimal(-1.2, 0, "ceil")).toBe(-1);
        expect(roundDecimal(1.2, 0, "expand")).toBe(2);
        expect(roundDecimal(1.2, 0, "trunc")).toBe(1);
        expect(roundDecimal(1234, -2, "halfExpand")).toBe(1200);
        expect(roundDecimal(1.25, 1, "halfEven")).toBe(1.2);
        expect(Object.is(roundDecimal(-0.2, 0, "trunc"), -0)).toBe(true);
        expect(roundDecimal(Number.NaN, 0, "halfExpand")).toBeUndefined();
    });

    it("adds decimal values", () => {
        expect(addDecimal(0.1, 0.2)).toBe(0.3);
        expect(subtractDecimal(0.3, 0.1)).toBe(0.2);
        expect(multiplyDecimal(0.1, 0.2)).toBe(0.02);
        expect(divideDecimal(1, 2)).toBe(0.5);
        expect(divideDecimal(1, 0)).toBeUndefined();
        expect(divideDecimal(1, -0)).toBeUndefined();
    });

    it("sums exact double values", () => {
        expect(sumExact([])).toBe(0);
        expect(Object.is(sumExact([-0]), -0)).toBe(true);
        expect(sumExact([1e20, 0.1, -1e20])).toBe(0.1);
        expect(sumExact([0.1, 0.2])).toBe(0.1 + 0.2);
        expect(sumExact([1, -1])).toBe(0);
        expect(sumExact([Number.NaN])).toBeUndefined();
    });
});
