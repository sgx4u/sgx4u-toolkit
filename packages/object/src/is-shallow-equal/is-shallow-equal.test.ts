import { describe, expect, it } from "vitest";
import { isShallowEqual } from "./is-shallow-equal.js";
import type { IsShallowEqualParams } from "./is-shallow-equal.types.js";

describe("isShallowEqual", () => {
    it("compares one level and nested objects by reference", () => {
        const nested = { b: 1 };

        expect(isShallowEqual({ first: { a: 1 }, second: { a: 1 } })).toBe(
            true,
        );
        expect(
            isShallowEqual({ first: { a: nested }, second: { a: nested } }),
        ).toBe(true);
        expect(
            isShallowEqual({
                first: { a: { b: 1 } },
                second: { a: { b: 1 } },
            }),
        ).toBe(false);
    });

    it("treats NaN as equal and compares symbol keys only when asked", () => {
        const id = Symbol("id");

        expect(isShallowEqual({ first: Number.NaN, second: Number.NaN })).toBe(
            true,
        );
        expect(isShallowEqual({ first: 0, second: -0 })).toBe(true);
        expect(
            isShallowEqual({
                first: { [id]: 1, a: 1 },
                second: { [id]: 2, a: 1 },
            }),
        ).toBe(true);
        expect(
            isShallowEqual({
                first: { [id]: 1, a: 1 },
                includeSymbols: true,
                second: { [id]: 2, a: 1 },
            }),
        ).toBe(false);
    });

    it("returns false for a non-object argument and does not throw", () => {
        expect(isShallowEqual(null as unknown as IsShallowEqualParams)).toBe(
            false,
        );
        expect(
            isShallowEqual({
                first: { a: 1 },
                includeSymbols: "yes" as unknown as boolean,
                second: { a: 1 },
            }),
        ).toBe(true);
    });
});
