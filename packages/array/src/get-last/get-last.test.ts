import { describe, expect, it } from "vitest";
import { getLast } from "./get-last.js";
import type { GetLastParams } from "./get-last.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getLast", () => {
    it("returns the last item of a bare array or a params object", () => {
        const params: GetLastParams<number> = { array: [1, 2, 3] };
        expect(getLast([1, 2, 3])).toBe(3);
        expect(getLast([1])).toBe(1);
        expect(getLast(params)).toBe(3);
        expect(getLast({ array: [1, 0], defaultValue: 5 })).toBe(0);
    });

    it("uses defaultValue only when the array is empty and the key is present", () => {
        expect(getLast([])).toBeUndefined();
        expect(getLast({ array: [] })).toBeUndefined();
        expect(getLast({ array: [], defaultValue: 0 })).toBe(0);
        expect(getLast({ array: [], defaultValue: false })).toBe(false);
        expect(
            getLast({ array: [] as number[], defaultValue: undefined }),
        ).toBeUndefined();

        const sparse = [1, 2, 3];
        delete sparse[2];
        expect(getLast({ array: sparse, defaultValue: "missing" })).toBe(
            undefined,
        );
    });

    it("returns undefined for invalid input", () => {
        expect(getLast(null)).toBeUndefined();
        expect(getLast({})).toBeUndefined();
        expect(getLast("text")).toBeUndefined();
        expect(getLast(new Uint8Array([1]))).toBeUndefined();
        expect(getLast(new Set([1]))).toBeUndefined();
        expect(getLast(oneNumber())).toBeUndefined();
    });

    it("does not mutate a frozen array", () => {
        const input = Object.freeze([1, 2]);
        expect(getLast(input)).toBe(2);
        expect(input).toEqual([1, 2]);
    });
});
