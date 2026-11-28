import { describe, expect, it } from "vitest";
import { rejectItems } from "./reject-items.js";
import type { RejectItemsParams } from "./reject-items.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("rejectItems", () => {
    it("keeps items for which the predicate is false", () => {
        const input = Object.freeze([1, 2, 3, 4]);
        const params: RejectItemsParams<number> = {
            array: input,
            predicate: (item) => item % 2 === 0,
        };
        const result = rejectItems(params);

        expect(result).toEqual([1, 3]);
        expect(result).not.toBe(input);
        expect(rejectItems({ array: [1], predicate: () => false })).toEqual([
            1,
        ]);
        expect(rejectItems({ array: [], predicate: () => true })).toEqual([]);
        expect(rejectItems({ array: [1, 2], predicate: () => true })).toEqual(
            [],
        );
        expect(rejectItems({ array: [1, 2], predicate: () => false })).toEqual([
            1, 2,
        ]);
        expect(input).toEqual([1, 2, 3, 4]);
    });

    it("passes a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 2;
        expect(
            rejectItems({
                array: sparse,
                predicate: (item) => item === undefined,
            }),
        ).toEqual([1, 2]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(rejectItems(null)).toBeUndefined();
        expect(rejectItems("text")).toBeUndefined();
        expect(
            rejectItems({
                array: "text" as unknown as number[],
                predicate: () => false,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => rejectItems({})).toThrow(TypeError);
        expect(() => rejectItems(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => rejectItems(new Set([1]))).toThrow(TypeError);
        expect(() => rejectItems(oneNumber())).toThrow(TypeError);
        expect(() =>
            rejectItems({
                array: [1],
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow('`predicate` must be a function; received "no".');
    });
});
