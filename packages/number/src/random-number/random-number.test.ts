import { describe, expect, it } from "vitest";
import { randomNumber } from "../index.js";

describe("randomNumber", () => {
    it("covers the documented behavior", () => {
        expect(randomNumber({ lower: 0, upper: 10, random: () => 0.5 })).toBe(
            5,
        );
        expect(
            randomNumber({
                lower: 2,
                upper: 2,
                includeUpper: true,
                random: () => 0,
            }),
        ).toBe(2);
        expect(() =>
            randomNumber({ lower: 2, upper: 1, random: () => 0 }),
        ).toThrow(RangeError);
        expect(() =>
            randomNumber({ lower: 1, upper: 1, random: () => 0 }),
        ).toThrow(RangeError);
        const upper = 1 + 2 * Number.EPSILON;
        const nearUpper = randomNumber({
            lower: 1,
            upper,
            includeUpper: false,
            random: () => 1 - Number.EPSILON,
        });
        expect(nearUpper).toBeGreaterThan(1);
        expect(nearUpper).toBeLessThan(upper);
    });
});
