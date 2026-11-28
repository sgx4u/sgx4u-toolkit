import { describe, expect, it } from "vitest";
import { getFirst } from "./get-first.js";
import type { GetFirstParams } from "./get-first.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getFirst", () => {
    it("returns the first item of a bare array or a params object", () => {
        const params: GetFirstParams<number> = { array: [1, 2, 3] };
        expect(getFirst([1, 2, 3])).toBe(1);
        expect(getFirst([1])).toBe(1);
        expect(getFirst(params)).toBe(1);
        expect(getFirst({ array: [0], defaultValue: 1 })).toBe(0);
    });

    it("uses defaultValue only when the array is empty and the key is present", () => {
        expect(getFirst([])).toBeUndefined();
        expect(getFirst({ array: [] })).toBeUndefined();
        expect(getFirst({ array: [], defaultValue: 0 })).toBe(0);
        expect(getFirst({ array: [], defaultValue: false })).toBe(false);
        expect(
            getFirst({ array: [] as number[], defaultValue: undefined }),
        ).toBeUndefined();

        const sparse: number[] = [];
        sparse.length = 1;
        expect(getFirst({ array: sparse, defaultValue: "missing" })).toBe(
            undefined,
        );
    });

    it("returns undefined for invalid input", () => {
        expect(getFirst(null)).toBeUndefined();
        expect(getFirst({})).toBeUndefined();
        expect(getFirst("text")).toBeUndefined();
        expect(getFirst(new Uint8Array([1]))).toBeUndefined();
        expect(getFirst(new Set([1]))).toBeUndefined();
        expect(getFirst(oneNumber())).toBeUndefined();
        expect(getFirst({ array: "text", defaultValue: 0 })).toBeUndefined();
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2]);
        expect(getFirst(input)).toBe(1);
        expect(input).toEqual([1, 2]);
    });
});
