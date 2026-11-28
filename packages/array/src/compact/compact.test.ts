import { describe, expect, it } from "vitest";
import { compact } from "./compact.js";
import type { Falsy } from "./compact.types.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("compact", () => {
    it("removes empty values and keeps the rest", () => {
        const kept = { value: 1 };
        const input = Object.freeze([
            0,
            -0,
            1,
            false,
            true,
            2,
            "",
            " ",
            3,
            null,
            undefined,
            Number.NaN,
            0n,
            1n,
            kept,
            [],
        ]);
        const result = compact(input);

        expect(result).toEqual([1, true, 2, " ", 3, 1n, kept, []]);
        expect(result).not.toBe(input);
        expect(result?.[6]).toBe(kept);
        expect(
            compact([0, -0, Number.NaN, false, "", null, undefined, 0n]),
        ).toEqual([]);
        expect(compact([])).toEqual([]);
        expect(compact([1])).toEqual([1]);
        expect(compact([0])).toEqual([]);
        expect(input).toHaveLength(16);
    });

    it("removes a hole", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 2;
        expect(compact(sparse)).toEqual([1, 2]);
    });

    it("returns undefined for invalid input", () => {
        expect(compact(null)).toBeUndefined();
        expect(compact({})).toBeUndefined();
        expect(compact("text")).toBeUndefined();
        expect(compact(new Uint8Array([1]))).toBeUndefined();
        expect(compact(new Set([1]))).toBeUndefined();
        expect(compact(oneNumber())).toBeUndefined();
    });

    it("excludes Falsy from the item type", () => {
        const falsy: Falsy = 0;
        const result: Array<1 | "a"> | undefined = compact([
            falsy,
            1,
            null,
            "a",
        ] as const);
        expect(result).toEqual([1, "a"]);
    });
});
