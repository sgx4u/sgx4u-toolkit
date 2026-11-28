import { describe, expect, it } from "vitest";
import { dropWhile } from "./drop-while.js";
import type { DropWhileParams } from "./drop-while.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("dropWhile", () => {
    it("drops the leading run", () => {
        const input = Object.freeze([1, 2, 0, 3]);
        const params: DropWhileParams<number> = {
            array: input,
            predicate: (item) => item > 0,
        };
        const result = dropWhile(params);

        expect(result).toEqual([0, 3]);
        expect(result).not.toBe(input);
        expect(dropWhile({ array: [1], predicate: () => true })).toEqual([]);
        expect(dropWhile({ array: [], predicate: () => true })).toEqual([]);
        expect(dropWhile({ array: [1, 2], predicate: () => false })).toEqual([
            1, 2,
        ]);
        expect(input).toEqual([1, 2, 0, 3]);
    });

    it("keeps a hole when the predicate stops there", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            dropWhile({
                array: sparse,
                predicate: (item) => item !== undefined,
            }),
        ).toEqual([undefined, 3]);
    });

    it("returns undefined for a non-object or a non-array", () => {
        expect(dropWhile(null)).toBeUndefined();
        expect(dropWhile("text")).toBeUndefined();
        expect(
            dropWhile({
                array: "text" as unknown as number[],
                predicate: () => true,
            }),
        ).toBeUndefined();
    });

    it("throws when predicate is not a function", () => {
        expect(() => dropWhile({})).toThrow(TypeError);
        expect(() => dropWhile(new Uint8Array([1]))).toThrow(TypeError);
        expect(() => dropWhile(new Set([1]))).toThrow(TypeError);
        expect(() => dropWhile(oneNumber())).toThrow(TypeError);
        expect(() =>
            dropWhile({
                array: [1],
                predicate: "no" as unknown as () => boolean,
            }),
        ).toThrow(TypeError);
    });
});
