import { describe, expect, it } from "vitest";
import { takeWhile } from "./take-while.js";
import type { TakeWhileParams } from "./take-while.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("takeWhile", () => {
    it("returns the leading run", () => {
        const input = Object.freeze([1, 2, 0, 3]);
        const params: TakeWhileParams<number> = {
            array: input,
            predicate: (item) => item > 0,
        };
        const result = takeWhile(params);

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(input);
        expect(takeWhile({ array: [1], predicate: () => true })).toEqual([1]);
        expect(takeWhile({ array: [], predicate: () => true })).toEqual([]);
        expect(takeWhile({ array: [1, 2], predicate: () => false })).toEqual(
            [],
        );
        expect(takeWhile({ array: [1, 2], predicate: () => true })).toEqual([
            1, 2,
        ]);
        expect(input).toEqual([1, 2, 0, 3]);
    });

    it("stops at a hole when the predicate rejects undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            takeWhile({
                array: sparse,
                predicate: (item) => item !== undefined,
            }),
        ).toEqual([1]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(takeWhile(null)).toBeUndefined();
        expect(takeWhile("text")).toBeUndefined();
        expect(
            takeWhile({
                array: "text" as unknown as number[],
                predicate: () => true,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => takeWhile({})).toThrow(TypeError);
        expect(() => takeWhile(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => takeWhile(new Set([1]))).toThrow(TypeError);
        expect(() => takeWhile(oneNumber())).toThrow(TypeError);
        expect(() =>
            takeWhile({
                array: [1],
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow(TypeError);
        expect(() =>
            takeWhile({
                array: "no",
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow('`predicate` must be a function; received "no".');
    });
});
