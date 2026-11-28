import { describe, expect, it } from "vitest";
import type { GetSymmetricDifferenceParams } from "./get-symmetric-difference.types.js";
import { getSymmetricDifference } from "./get-symmetric-difference.js";

function* generate(): Generator<number[], void, unknown> {
    yield [1];
}

describe("getSymmetricDifference", () => {
    it("keeps items that occur in an odd number of arrays", () => {
        const params: GetSymmetricDifferenceParams<number> = {
            arrays: [
                [1, 2, 2],
                [2, 3],
            ],
        };
        const result = getSymmetricDifference(params);
        expect(result).toEqual([1, 3]);
        expect(result).not.toBe(params.arrays[0]);
    });

    it("counts presence once per array and keeps first-seen order", () => {
        expect(
            getSymmetricDifference({
                arrays: [
                    [1, 2],
                    [2, 3],
                    [1, 3],
                ],
            }),
        ).toEqual([]);
        expect(
            getSymmetricDifference({
                arrays: [[1], [1], [1]],
            }),
        ).toEqual([1]);
        expect(
            getSymmetricDifference({
                arrays: [[1, 2], [3, 1], [4]],
            }),
        ).toEqual([2, 3, 4]);
    });

    it("returns an empty array for an empty list", () => {
        const arrays: number[][] = [];
        const result = getSymmetricDifference({ arrays });
        expect(result).toEqual([]);
        expect(result).not.toBe(arrays);
    });

    it("lets by win over equals and treats NaN and -0 as matches", () => {
        expect(
            getSymmetricDifference({
                arrays: [
                    [
                        { id: 1, name: "a" },
                        { id: 2, name: "b" },
                    ],
                    [{ id: 1, name: "c" }],
                ],
                by: "id",
                equals: () => false,
            }),
        ).toEqual([{ id: 2, name: "b" }]);
        expect(
            getSymmetricDifference({
                arrays: [
                    [Number.NaN, 0],
                    [Number.NaN, -0, 1],
                ],
            }),
        ).toEqual([1]);
    });

    it("returns undefined when arrays is not an array of arrays", () => {
        expect(getSymmetricDifference(null)).toBeUndefined();
        expect(getSymmetricDifference({})).toBeUndefined();
        expect(getSymmetricDifference("text")).toBeUndefined();
        expect(getSymmetricDifference(new Uint8Array([1]))).toBeUndefined();
        expect(getSymmetricDifference(new Set([1]))).toBeUndefined();
        expect(getSymmetricDifference(generate())).toBeUndefined();
        expect(
            getSymmetricDifference({ arrays: [[1], "no"] as never }),
        ).toBeUndefined();
    });

    it("does not mutate a frozen input", () => {
        const first = Object.freeze([1, 2]);
        const second = Object.freeze([2, 3]);
        expect(getSymmetricDifference({ arrays: [first, second] })).toEqual([
            1, 3,
        ]);
        expect(first).toEqual([1, 2]);
    });

    it("copies holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 2;
        expect(getSymmetricDifference({ arrays: [sparse, [1]] })).toEqual([
            undefined,
            2,
        ]);
    });

    it("throws when by or equals is invalid", () => {
        expect(() =>
            getSymmetricDifference({ arrays: [[1]], by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            getSymmetricDifference({ arrays: [[1]], equals: "nope" as never }),
        ).toThrow(TypeError);
    });
});
