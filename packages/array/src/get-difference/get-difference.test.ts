import { describe, expect, it } from "vitest";
import type { GetDifferenceParams } from "./get-difference.types.js";
import { getDifference } from "./get-difference.js";

function* generate(): Generator<number[], void, unknown> {
    yield [1];
}

describe("getDifference", () => {
    it("keeps unique items that appear in none of the other arrays", () => {
        const params: GetDifferenceParams<number> = {
            array: [1, 2, 2, 3, 1],
            others: [[2], [4]],
        };
        const result = getDifference(params);
        expect(result).toEqual([1, 3]);
        expect(result).not.toBe(params.array);
    });

    it("returns the unique source when others is empty", () => {
        expect(getDifference({ array: [1, 1, 2], others: [] })).toEqual([1, 2]);
        const array: number[] = [];
        const result = getDifference({ array, others: [[1]] });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("lets by win over equals", () => {
        expect(
            getDifference({
                array: [
                    { id: 1, name: "a" },
                    { id: 2, name: "b" },
                ],
                others: [[{ id: 1, name: "other" }]],
                by: "id",
                equals: () => false,
            }),
        ).toEqual([{ id: 2, name: "b" }]);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            getDifference({
                array: [Number.NaN, 0, 1, -0],
                others: [[Number.NaN, -0]],
            }),
        ).toEqual([1]);
    });

    it("returns undefined when array or others is not an array of arrays", () => {
        expect(getDifference(null)).toBeUndefined();
        expect(getDifference({})).toBeUndefined();
        expect(getDifference("text")).toBeUndefined();
        expect(getDifference(new Uint8Array([1]))).toBeUndefined();
        expect(getDifference(new Set([1]))).toBeUndefined();
        expect(getDifference(generate())).toBeUndefined();
        expect(
            getDifference({ array: [1], others: "no" as never }),
        ).toBeUndefined();
        expect(
            getDifference({ array: "text" as never, others: [[1]] }),
        ).toBeUndefined();
        expect(
            getDifference({ array: [1], others: [1] as never }),
        ).toBeUndefined();
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2, 2]);
        const others = Object.freeze([Object.freeze([2])]);
        expect(getDifference({ array, others })).toEqual([1]);
        expect(array).toEqual([1, 2, 2]);
    });

    it("copies holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 2;
        expect(getDifference({ array: sparse, others: [[1]] })).toEqual([
            undefined,
            2,
        ]);
    });

    it("throws when by or equals is invalid", () => {
        expect(() =>
            getDifference({ array: [1], others: [], by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            getDifference({ array: [1], others: [], equals: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            getDifference({
                array: "text" as never,
                others: "no" as never,
                by: null as never,
            }),
        ).toThrow(TypeError);
    });
});
