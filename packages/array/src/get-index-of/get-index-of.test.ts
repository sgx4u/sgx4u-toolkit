import { describe, expect, it } from "vitest";
import { getIndexOf } from "./get-index-of.js";
import type { GetIndexOfParams } from "./get-index-of.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getIndexOf", () => {
    it("returns the first matching index", () => {
        const params: GetIndexOfParams<number> = {
            array: [1, 2, 1],
            value: 1,
        };
        expect(getIndexOf(params)).toBe(0);
        expect(getIndexOf({ array: [1, 2, 1], value: 2 })).toBe(1);
        expect(getIndexOf({ array: [1], value: 1 })).toBe(0);
        expect(getIndexOf({ array: [], value: 1 })).toBeUndefined();
        expect(getIndexOf({ array: [1, 2, 3], value: 4 })).toBeUndefined();
    });

    it("matches NaN and treats -0 as 0", () => {
        expect(
            getIndexOf({ array: [1, Number.NaN, 3], value: Number.NaN }),
        ).toBe(1);
        expect(getIndexOf({ array: [-0, 1], value: 0 })).toBe(0);
        expect(getIndexOf({ array: [0], value: -0 })).toBe(0);
        expect(
            getIndexOf({ array: [-0], value: 0, equals: Object.is }),
        ).toBeUndefined();
    });

    it("starts at fromIndex and clamps a negative index", () => {
        expect(getIndexOf({ array: [1, 2, 1], value: 1, fromIndex: 1 })).toBe(
            2,
        );
        expect(
            getIndexOf({ array: [1, 2, 3, 2], value: 2, fromIndex: -3 }),
        ).toBe(1);
        expect(getIndexOf({ array: [1, 2, 3], value: 1, fromIndex: -10 })).toBe(
            0,
        );
        expect(
            getIndexOf({ array: [1, 2, 3], value: 1, fromIndex: 3 }),
        ).toBeUndefined();
        expect(
            getIndexOf({ array: [1, 2, 3], value: 1, fromIndex: 0.5 }),
        ).toBeUndefined();
    });

    it("passes the item and the search value to equals", () => {
        const seen: unknown[][] = [];
        expect(
            getIndexOf({
                array: ["a", "B"],
                value: "b",
                equals: (left, right) => {
                    seen.push([left, right]);
                    return (
                        typeof left === "string" &&
                        typeof right === "string" &&
                        left.toLowerCase() === right.toLowerCase()
                    );
                },
            }),
        ).toBe(1);
        expect(seen).toEqual([
            ["a", "b"],
            ["B", "b"],
        ]);
    });

    it("reads a hole as undefined", () => {
        const sparse: Array<number | undefined> = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(getIndexOf({ array: sparse, value: undefined })).toBe(1);
    });

    it("returns undefined for invalid input", () => {
        expect(getIndexOf(null)).toBeUndefined();
        expect(getIndexOf({})).toBeUndefined();
        expect(getIndexOf("text")).toBeUndefined();
        expect(getIndexOf(new Uint8Array([1]))).toBeUndefined();
        expect(getIndexOf(new Set([1]))).toBeUndefined();
        expect(getIndexOf(oneNumber())).toBeUndefined();
    });

    it("throws when equals is not a function", () => {
        expect(() =>
            getIndexOf({
                array: [1],
                value: 1,
                equals: "no" as unknown as (
                    left: number,
                    right: number,
                ) => boolean,
            }),
        ).toThrow(TypeError);
        expect(() =>
            getIndexOf({
                array: "no" as unknown as number[],
                value: 1,
                equals: "no" as unknown as (
                    left: number,
                    right: number,
                ) => boolean,
            }),
        ).toThrow('`equals` must be a function; received "no".');
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2, 1]);
        expect(getIndexOf({ array: input, value: 1 })).toBe(0);
        expect(input).toEqual([1, 2, 1]);
    });
});
