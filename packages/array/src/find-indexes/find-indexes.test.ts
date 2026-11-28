import { describe, expect, it } from "vitest";
import { findIndexes } from "./find-indexes.js";
import type { FindIndexesParams } from "./find-indexes.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("findIndexes", () => {
    it("returns every matching index in order", () => {
        const params: FindIndexesParams<number> = {
            array: [1, 2, 1],
            predicate: (item) => item === 1,
        };
        const result = findIndexes(params);
        expect(result).toEqual([0, 2]);
        expect(result).not.toBe(params.array);
        expect(findIndexes({ array: [1], predicate: () => true })).toEqual([0]);
        expect(findIndexes({ array: [], predicate: () => true })).toEqual([]);
        expect(findIndexes({ array: [1, 2], predicate: () => false })).toEqual(
            [],
        );
    });

    it("passes a hole to the predicate as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        const seen: unknown[] = [];
        expect(
            findIndexes({
                array: sparse,
                predicate: (item, index, array) => {
                    seen.push(item);
                    expect(array).toBe(sparse);
                    expect(index).toBe(seen.length - 1);
                    return item === undefined;
                },
            }),
        ).toEqual([1]);
        expect(seen).toEqual([1, undefined, 3]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(findIndexes(null)).toBeUndefined();
        expect(findIndexes("text")).toBeUndefined();
        expect(
            findIndexes({
                array: "text" as unknown as number[],
                predicate: () => true,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => findIndexes({})).toThrow(TypeError);
        expect(() => findIndexes(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => findIndexes(new Set([1]))).toThrow(TypeError);
        expect(() => findIndexes(oneNumber())).toThrow(TypeError);
        expect(() =>
            findIndexes({
                array: [1],
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow('`predicate` must be a function; received "no".');
        expect(() =>
            findIndexes({
                array: "no",
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow(TypeError);
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2, 1]);
        const result = findIndexes({
            array: input,
            predicate: (item) => item === 1,
        });
        expect(result).toEqual([0, 2]);
        expect(input).toEqual([1, 2, 1]);
    });
});
