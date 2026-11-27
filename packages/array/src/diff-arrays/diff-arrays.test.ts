import { describe, expect, it } from "vitest";
import { diffArrays } from "./diff-arrays.js";

describe("diffArrays", () => {
    it("returns undefined when either side is not an array", () => {
        expect(
            diffArrays({ first: "no", second: [1] } as never),
        ).toBeUndefined();
        expect(
            diffArrays({ first: [1], second: null } as never),
        ).toBeUndefined();
        expect(diffArrays(undefined as never)).toBeUndefined();
    });

    it("consumes one occurrence per match, in appearance order", () => {
        const first = Object.freeze([1, 1, 2]);
        const second = Object.freeze([1, 3]);
        const diff = diffArrays({ first, second });
        expect(diff).toEqual({ removed: [1, 2], added: [3] });
        expect(diff?.removed).not.toBe(first);
        expect(first).toEqual([1, 1, 2]);
        expect(second).toEqual([1, 3]);
    });

    it("matches NaN and accepts a custom equals", () => {
        expect(
            diffArrays({ first: [Number.NaN, 1], second: [Number.NaN] }),
        ).toEqual({ removed: [1], added: [] });
        expect(
            diffArrays({
                first: ["a", "B"],
                second: ["A"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual({ removed: ["B"], added: [] });
    });

    it("throws when equals is not a function", () => {
        expect(() =>
            diffArrays({ first: [1], second: [1], equals: "no" as never }),
        ).toThrow(TypeError);
    });
});
