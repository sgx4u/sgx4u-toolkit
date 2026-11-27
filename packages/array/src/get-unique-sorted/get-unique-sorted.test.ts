import { describe, expect, it } from "vitest";
import type { GetUniqueSortedParams } from "./get-unique-sorted.types.js";
import { getUniqueSorted } from "./get-unique-sorted.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("getUniqueSorted", () => {
    it("drops only adjacent duplicates", () => {
        const array = [1, 1, 2, 2, 3, 1];
        const params: GetUniqueSortedParams<number> = { array };
        const result = getUniqueSorted(params);
        expect(result).toEqual([1, 2, 3, 1]);
        expect(result).not.toBe(array);
    });

    it("compares adjacent keys with SameValueZero", () => {
        expect(
            getUniqueSorted({
                array: [Number.NaN, Number.NaN, 0, -0, 1],
            }),
        ).toEqual([Number.NaN, 0, 1]);
        expect(
            getUniqueSorted({
                array: [{ id: 1 }, { id: 1 }, { id: 2 }, { id: 1 }],
                by: "id",
            }),
        ).toEqual([{ id: 1 }, { id: 2 }, { id: 1 }]);
    });

    it("returns a new empty array for an empty array", () => {
        const array: number[] = [];
        const result = getUniqueSorted({ array });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-array", () => {
        expect(getUniqueSorted(null)).toBeUndefined();
        expect(getUniqueSorted({})).toBeUndefined();
        expect(getUniqueSorted("text")).toBeUndefined();
        expect(getUniqueSorted(new Uint8Array([1]))).toBeUndefined();
        expect(getUniqueSorted(new Set([1]))).toBeUndefined();
        expect(getUniqueSorted(generate())).toBeUndefined();
        expect(getUniqueSorted({ array: "text" as never })).toBeUndefined();
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 1, 2]);
        expect(getUniqueSorted({ array })).toEqual([1, 2]);
        expect(array).toEqual([1, 1, 2]);
    });

    it("reads holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 1;
        expect(getUniqueSorted({ array: sparse })).toEqual([1, undefined, 1]);
    });

    it("throws when by is present and is not an iteratee", () => {
        expect(() => getUniqueSorted({ array: [1], by: {} as never })).toThrow(
            TypeError,
        );
        expect(() =>
            getUniqueSorted({ array: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });
});
