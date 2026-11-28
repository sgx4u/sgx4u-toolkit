import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { getUniqueItems } from "../get-unique-items/get-unique-items.js";
import type { GetUnionParams } from "./get-union.types.js";
import { getUnion } from "./get-union.js";

function* generate(): Generator<number[], void, unknown> {
    yield [1];
}

describe("getUnion", () => {
    it("keeps the first-seen item across every array", () => {
        const params: GetUnionParams<number> = {
            arrays: [
                [1, 2],
                [2, 3],
                [3, 4],
            ],
        };
        const result = getUnion(params);
        expect(result).toEqual([1, 2, 3, 4]);
        expect(result).not.toBe(params.arrays[0]);
    });

    it("returns an empty array for an empty list and unique items for one array", () => {
        expect(getUnion({ arrays: [] })).toEqual([]);
        expect(getUnion({ arrays: [[1, 1, 2]] })).toEqual([1, 2]);
        const empty: number[][] = [];
        const result = getUnion({ arrays: empty });
        expect(result).toEqual([]);
        expect(result).not.toBe(empty);
    });

    it("lets by win over equals and treats NaN and -0 as matches", () => {
        expect(
            getUnion({
                arrays: [[{ id: 1, name: "a" }], [{ id: 1, name: "b" }]],
                by: "id",
                equals: () => false,
            }),
        ).toEqual([{ id: 1, name: "a" }]);
        expect(
            getUnion({
                arrays: [
                    [Number.NaN, 0],
                    [-0, Number.NaN, 1],
                ],
            }),
        ).toEqual([Number.NaN, 0, 1]);
    });

    it("uses a custom equals function when by is omitted", () => {
        expect(
            getUnion({
                arrays: [
                    ["a", "B"],
                    ["b", "c"],
                ],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["a", "B", "c"]);
    });

    it("returns undefined for a non-object and for a list that is not arrays", () => {
        expect(getUnion(null)).toBeUndefined();
        expect(getUnion("text")).toBeUndefined();
        expect(getUnion({})).toBeUndefined();
        expect(getUnion(new Uint8Array([1]))).toBeUndefined();
        expect(getUnion(new Set([1]))).toBeUndefined();
        expect(getUnion(generate())).toBeUndefined();
        expect(getUnion(generate)).toBeUndefined();
        expect(getUnion({ arrays: [1, 2] as never })).toBeUndefined();
        expect(getUnion({ arrays: [[1], "no"] as never })).toBeUndefined();
    });

    it("does not mutate frozen arrays", () => {
        const first = Object.freeze([1, 1, 2]);
        const second = Object.freeze([2, 3]);
        const arrays = Object.freeze([first, second]);
        expect(getUnion({ arrays })).toEqual([1, 2, 3]);
        expect(first).toEqual([1, 1, 2]);
        expect(second).toEqual([2, 3]);
    });

    it("copies holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 1;
        expect(getUnion({ arrays: [sparse, [undefined, 2]] })).toEqual([
            1,
            undefined,
            2,
        ]);
    });

    it("throws when by or equals is invalid", () => {
        expect(() => getUnion({ arrays: [[1]], by: {} as never })).toThrow(
            TypeError,
        );
        expect(() =>
            getUnion({ arrays: [[1]], equals: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            getUnion({ arrays: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });

    it("matches the first-seen unique values of the concatenation", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()),
                fc.array(fc.integer()),
                (left, right) => {
                    const union = getUnion({ arrays: [left, right] });
                    const expected = getUniqueItems([...left, ...right]);
                    expect(union).toEqual(expected);
                    expect(getUniqueItems(union ?? [])).toEqual(union);
                },
            ),
        );
    });
});
