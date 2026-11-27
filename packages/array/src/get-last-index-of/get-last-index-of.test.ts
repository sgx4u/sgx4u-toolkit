import { describe, expect, it } from "vitest";
import { getLastIndexOf } from "./get-last-index-of.js";
import type { GetLastIndexOfParams } from "./get-last-index-of.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getLastIndexOf", () => {
    it("returns the last matching index", () => {
        const params: GetLastIndexOfParams<number> = {
            array: [1, 2, 1, 2],
            value: 1,
        };
        expect(getLastIndexOf(params)).toBe(2);
        expect(getLastIndexOf({ array: [1], value: 1 })).toBe(0);
        expect(getLastIndexOf({ array: [], value: 1 })).toBeUndefined();
        expect(getLastIndexOf({ array: [1, 2, 3], value: 4 })).toBeUndefined();
    });

    it("matches NaN and treats -0 as 0", () => {
        expect(
            getLastIndexOf({
                array: [Number.NaN, 1, Number.NaN],
                value: Number.NaN,
            }),
        ).toBe(2);
        expect(getLastIndexOf({ array: [1, 0, -0], value: 0 })).toBe(2);
        expect(
            getLastIndexOf({ array: [-0], value: 0, equals: Object.is }),
        ).toBeUndefined();
    });

    it("searches backward from fromIndex", () => {
        expect(
            getLastIndexOf({ array: [1, 2, 1, 2], value: 1, fromIndex: 1 }),
        ).toBe(0);
        expect(
            getLastIndexOf({ array: [1, 2, 1, 2], value: 2, fromIndex: 100 }),
        ).toBe(3);
        expect(
            getLastIndexOf({ array: [1, 2, 3], value: 1, fromIndex: -1 }),
        ).toBe(0);
        expect(
            getLastIndexOf({ array: [1, 2, 3], value: 3, fromIndex: 0 }),
        ).toBeUndefined();
        expect(
            getLastIndexOf({ array: [1, 2, 3], value: 1, fromIndex: -10 }),
        ).toBeUndefined();
        expect(
            getLastIndexOf({ array: [1, 2, 3], value: 1, fromIndex: 1.5 }),
        ).toBeUndefined();
        expect(getLastIndexOf({ array: [], value: 1, fromIndex: 0 })).toBe(
            undefined,
        );
    });

    it("reads a hole as undefined", () => {
        const sparse: Array<number | undefined> = [];
        sparse[0] = 1;
        sparse[2] = 1;
        expect(getLastIndexOf({ array: sparse, value: undefined })).toBe(1);
    });

    it("returns undefined for invalid input", () => {
        expect(getLastIndexOf(null)).toBeUndefined();
        expect(getLastIndexOf({})).toBeUndefined();
        expect(getLastIndexOf("text")).toBeUndefined();
        expect(getLastIndexOf(new Uint8Array([1]))).toBeUndefined();
        expect(getLastIndexOf(new Set([1]))).toBeUndefined();
        expect(getLastIndexOf(oneNumber())).toBeUndefined();
    });

    it("throws when equals is not a function", () => {
        expect(() =>
            getLastIndexOf({
                array: [1],
                value: 1,
                equals: 1 as unknown as (
                    left: number,
                    right: number,
                ) => boolean,
            }),
        ).toThrow(TypeError);
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2, 1]);
        expect(getLastIndexOf({ array: input, value: 1 })).toBe(2);
        expect(input).toEqual([1, 2, 1]);
    });
});
