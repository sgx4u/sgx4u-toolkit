import { describe, expect, it } from "vitest";
import type { GetIntersectionParams } from "./get-intersection.types.js";
import { getIntersection } from "./get-intersection.js";

function* generate(): Generator<number[], void, unknown> {
    yield [1];
}

describe("getIntersection", () => {
    it("keeps first-array items that appear in every later array", () => {
        const params: GetIntersectionParams<number> = {
            arrays: [
                [1, 2, 2, 3],
                [2, 3, 3],
                [3, 2, 9],
            ],
        };
        const result = getIntersection(params);
        expect(result).toEqual([2, 3]);
        expect(result).not.toBe(params.arrays[0]);
    });

    it("returns an empty array for an empty list and unique items for one array", () => {
        expect(getIntersection({ arrays: [] })).toEqual([]);
        expect(getIntersection({ arrays: [[1, 1, 2]] })).toEqual([1, 2]);
    });

    it("returns items from the first array when by matches", () => {
        expect(
            getIntersection({
                arrays: [
                    [
                        { id: 1, name: "first" },
                        { id: 2, name: "only" },
                    ],
                    [{ id: 1, name: "second" }],
                ],
                by: "id",
                equals: () => false,
            }),
        ).toEqual([{ id: 1, name: "first" }]);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            getIntersection({
                arrays: [
                    [Number.NaN, 0, 1],
                    [Number.NaN, -0],
                ],
            }),
        ).toEqual([Number.NaN, 0]);
    });

    it("returns undefined when arrays is not an array of arrays", () => {
        expect(getIntersection(null)).toBeUndefined();
        expect(getIntersection({})).toBeUndefined();
        expect(getIntersection("text")).toBeUndefined();
        expect(getIntersection(new Uint8Array([1]))).toBeUndefined();
        expect(getIntersection(new Set([[1]]))).toBeUndefined();
        expect(getIntersection(generate())).toBeUndefined();
        expect(getIntersection({ arrays: [[1], 2] as never })).toBeUndefined();
    });

    it("does not mutate a frozen input", () => {
        const first = Object.freeze([1, 2, 2]);
        const second = Object.freeze([2, 1]);
        expect(getIntersection({ arrays: [first, second] })).toEqual([1, 2]);
        expect(first).toEqual([1, 2, 2]);
    });

    it("copies holes as undefined", () => {
        const sparse: number[] = [];
        sparse[1] = 2;
        expect(getIntersection({ arrays: [sparse, [undefined, 2]] })).toEqual([
            undefined,
            2,
        ]);
    });

    it("throws when by or equals is invalid", () => {
        expect(() =>
            getIntersection({ arrays: [[1]], by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            getIntersection({ arrays: [[1]], equals: "nope" as never }),
        ).toThrow(TypeError);
    });
});
