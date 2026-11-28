import { describe, expect, it } from "vitest";
import { isEqual } from "./is-equal.js";
import type { IsEqualParams } from "./is-equal.types.js";

/**
 * `[1, empty, 3]`. The hole is a missing index, not a stored `undefined`.
 *
 * @returns A sparse array of length 3.
 */
function arrayWithHole(): unknown[] {
    const value: unknown[] = [];
    value.length = 3;
    value[0] = 1;
    value[2] = 3;
    return value;
}

describe("isEqual", () => {
    it("treats NaN as equal and +0 as equal to -0", () => {
        expect(isEqual({ first: Number.NaN, second: Number.NaN })).toBe(true);
        expect(isEqual({ first: 0, second: -0 })).toBe(true);
        expect(
            isEqual({
                first: { a: Number.NaN, b: 0 },
                second: { a: Number.NaN, b: -0 },
            }),
        ).toBe(true);
    });

    it("treats invalid dates as equal", () => {
        expect(
            isEqual({
                first: new Date(Number.NaN),
                second: new Date(Number.NaN),
            }),
        ).toBe(true);
        expect(
            isEqual({
                first: new Date(0),
                second: new Date(1),
            }),
        ).toBe(false);
    });

    it("distinguishes sparse arrays from arrays that store undefined", () => {
        const sparse = arrayWithHole();
        const matching = arrayWithHole();
        const dense = [1, undefined, 3];
        const longer = arrayWithHole();
        longer[3] = 4;

        expect(isEqual({ first: sparse, second: matching })).toBe(true);
        expect(isEqual({ first: sparse, second: dense })).toBe(false);
        expect(isEqual({ first: sparse, second: longer })).toBe(false);
    });

    it("compares symbol keys only when includeSymbols is true", () => {
        const id = Symbol("id");
        const left = { [id]: 1, name: "a" };
        const right = { [id]: 2, name: "a" };
        const without = { name: "a" };

        expect(isEqual({ first: left, second: right })).toBe(true);
        expect(isEqual({ first: left, second: without })).toBe(true);
        expect(
            isEqual({ first: left, includeSymbols: true, second: right }),
        ).toBe(false);
        expect(
            isEqual({
                first: left,
                includeSymbols: true,
                second: { [id]: 1, name: "a" },
            }),
        ).toBe(true);
    });

    it("compares non-enumerable keys only when asked", () => {
        const left = {};
        const right = {};
        Object.defineProperty(left, "hidden", { value: 1 });
        Object.defineProperty(right, "hidden", { value: 2 });

        expect(isEqual({ first: left, second: right })).toBe(true);
        expect(
            isEqual({
                first: left,
                includeNonEnumerable: true,
                second: right,
            }),
        ).toBe(false);
    });

    it("tolerates cycles and ignores circular, including throw and unknown", () => {
        const left: { self?: object; n: number } = { n: 1 };
        const right: { self?: object; n: number } = { n: 1 };
        left.self = left;
        right.self = right;

        expect(isEqual({ first: left, second: right })).toBe(true);
        expect(isEqual({ circular: "throw", first: left, second: right })).toBe(
            true,
        );
        expect(
            isEqual({
                circular: "nope",
                first: left,
                second: right,
            }),
        ).toBe(true);
        expect(isEqual({ first: left, second: { n: 1, self: { n: 1 } } })).toBe(
            false,
        );
    });

    it("returns false for a non-object argument and does not throw", () => {
        expect(isEqual(null as unknown as IsEqualParams)).toBe(false);
        expect(isEqual(undefined as unknown as IsEqualParams)).toBe(false);
    });
});
