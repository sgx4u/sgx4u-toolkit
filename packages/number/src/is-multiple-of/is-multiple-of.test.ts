import { describe, expect, it } from "vitest";
import { isMultipleOf } from "../index.js";

describe("isMultipleOf", () => {
    it("accepts integer multiples", () => {
        expect(isMultipleOf({ value: 10, divisor: 5 })).toBe(true);
        expect(isMultipleOf({ value: -9, divisor: 3 })).toBe(true);
        expect(isMultipleOf({ value: 0, divisor: 4 })).toBe(true);
    });

    it("rejects non-integers and a zero divisor", () => {
        expect(isMultipleOf({ value: 1.5, divisor: 1 })).toBe(false);
        expect(isMultipleOf({ value: 4, divisor: 0 })).toBe(false);
        expect(isMultipleOf({ value: Number.NaN, divisor: 1 })).toBe(false);
    });
});
