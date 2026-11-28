import { describe, expect, it } from "vitest";
import type { MergeSortedParams } from "./merge-sorted.types.js";
import { mergeSorted } from "./merge-sorted.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("mergeSorted", () => {
    it("takes from the first array when the keys tie", () => {
        const first = [
            { id: 1, source: "first" },
            { id: 3, source: "first" },
        ];
        const second = [
            { id: 2, source: "second" },
            { id: 3, source: "second" },
            { id: 4, source: "second" },
        ];
        const params: MergeSortedParams<{ id: number; source: string }> = {
            first,
            second,
            by: "id",
            locale: "en-US",
        };
        const result = mergeSorted(params);
        expect(result).toEqual([
            { id: 1, source: "first" },
            { id: 2, source: "second" },
            { id: 3, source: "first" },
            { id: 3, source: "second" },
            { id: 4, source: "second" },
        ]);
        expect(result).not.toBe(first);
        expect(result).not.toBe(second);
    });

    it("merges numbers and uses numeric string order", () => {
        expect(
            mergeSorted({
                first: [1, 3, 5],
                second: [2, 3, 4],
                locale: "en-US",
            }),
        ).toEqual([1, 2, 3, 3, 4, 5]);
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                mergeSorted({
                    first: ["item1", "item10"],
                    second: ["item2", "item3"],
                    numeric: true,
                    locale,
                }),
            ).toEqual(["item1", "item2", "item3", "item10"]);
        }
    });

    it("copies the other side when one side is empty", () => {
        const first = [1, 2];
        const result = mergeSorted({
            first,
            second: [],
            locale: "en-US",
        });
        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(first);
        expect(mergeSorted({ first: [], second: [], locale: "en-US" })).toEqual(
            [],
        );
    });

    it("returns undefined when either side is not an array", () => {
        expect(mergeSorted(null)).toBeUndefined();
        expect(mergeSorted({})).toBeUndefined();
        expect(mergeSorted("text")).toBeUndefined();
        expect(mergeSorted(new Uint8Array([1]))).toBeUndefined();
        expect(mergeSorted(new Set([1]))).toBeUndefined();
        expect(mergeSorted(generate())).toBeUndefined();
        expect(
            mergeSorted({ first: [1], second: "no" as never, locale: "en-US" }),
        ).toBeUndefined();
        expect(
            mergeSorted({ first: "no" as never, second: [1], locale: "en-US" }),
        ).toBeUndefined();
    });

    it("does not mutate frozen inputs and reads holes as undefined", () => {
        const first = Object.freeze([1, 4]);
        const second = Object.freeze([2, 3]);
        expect(mergeSorted({ first, second, locale: "en-US" })).toEqual([
            1, 2, 3, 4,
        ]);
        expect(first).toEqual([1, 4]);
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            mergeSorted({ first: sparse, second: [2], locale: "en-US" }),
        ).toEqual([1, 2, undefined, 3]);
    });

    it("throws when by or numeric is invalid", () => {
        expect(() =>
            mergeSorted({
                first: [1],
                second: [2],
                by: {} as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
        expect(() =>
            mergeSorted({
                first: [1],
                second: [2],
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
        expect(() =>
            mergeSorted({
                first: "no" as never,
                second: "no" as never,
                by: null as never,
            }),
        ).toThrow(TypeError);
    });
});
