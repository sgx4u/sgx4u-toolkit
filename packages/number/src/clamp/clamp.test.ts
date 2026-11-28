import { describe, expect, it } from "vitest";
import { assert, double, property } from "fast-check";
import { clamp } from "../index.js";

describe("clamp", () => {
    it("covers the documented behavior", () => {
        expect(clamp({ value: 5, lower: 0, upper: 3 })).toBe(3);
        expect(clamp({ value: -2, lower: 0, upper: 3 })).toBe(0);
        expect(clamp({ value: 1, lower: 0, upper: 3 })).toBe(1);
        expect(Object.is(clamp({ value: -4, lower: -0, upper: 1 }), -0)).toBe(
            true,
        );
        expect(Object.is(clamp({ value: -0, lower: -1, upper: 1 }), -0)).toBe(
            true,
        );
        expect(
            clamp({ value: Number.NaN, lower: 0, upper: 1 }),
        ).toBeUndefined();
        expect(() => clamp({ value: 1, lower: 2, upper: 1 })).toThrow(
            RangeError,
        );
        assert(
            property(
                double({
                    min: -1000,
                    max: 1000,
                    noNaN: true,
                    noDefaultInfinity: true,
                }),
                double({
                    min: -1000,
                    max: 1000,
                    noNaN: true,
                    noDefaultInfinity: true,
                }),
                double({
                    min: -1000,
                    max: 1000,
                    noNaN: true,
                    noDefaultInfinity: true,
                }),
                (value, first, second) => {
                    const lower = Math.min(first, second);
                    const upper = Math.max(first, second);
                    const clamped = clamp({ value, lower, upper });
                    expect(clamped).toBeGreaterThanOrEqual(lower);
                    expect(clamped).toBeLessThanOrEqual(upper);
                },
            ),
        );
    });
});
