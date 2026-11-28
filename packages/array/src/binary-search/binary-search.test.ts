import { describe, expect, it } from "vitest";
import type { BinarySearchParams } from "./binary-search.types.js";
import { binarySearch } from "./binary-search.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("binarySearch", () => {
    it("returns the leftmost match and undefined when the value is absent", () => {
        const params: BinarySearchParams<number> = {
            array: [1, 2, 2, 3],
            value: 2,
            locale: "en-US",
        };
        expect(binarySearch(params)).toBe(1);
        expect(
            binarySearch({ array: [1, 2, 3], value: 4, locale: "en-US" }),
        ).toBeUndefined();
        expect(
            binarySearch({ array: [], value: 1, locale: "en-US" }),
        ).toBeUndefined();
    });

    it("compares extracted keys and uses numeric order", () => {
        expect(
            binarySearch({
                array: [{ id: 1 }, { id: 3 }, { id: 3 }],
                value: { id: 3 },
                by: "id",
                locale: "en-US",
            }),
        ).toBe(1);
        expect(
            binarySearch({
                array: [{ id: 1 }, { id: 3 }],
                value: { id: 2 },
                by: "id",
                locale: "en-US",
            }),
        ).toBeUndefined();
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                binarySearch({
                    array: ["item1", "item2", "item10"],
                    value: "item2",
                    numeric: true,
                    locale,
                }),
            ).toBe(1);
            expect(
                binarySearch({
                    array: ["item1", "item2", "item10"],
                    value: "item3",
                    numeric: true,
                    locale,
                }),
            ).toBeUndefined();
        }
    });

    it("finds NaN and treats -0 as 0", () => {
        expect(
            binarySearch({
                array: [1, 2, Number.NaN],
                value: Number.NaN,
                locale: "en-US",
            }),
        ).toBe(2);
        expect(
            binarySearch({ array: [-0, 1], value: 0, locale: "en-US" }),
        ).toBe(0);
    });

    it("returns undefined for a non-array and does not mutate input", () => {
        expect(binarySearch(null)).toBeUndefined();
        expect(binarySearch({})).toBeUndefined();
        expect(binarySearch("text")).toBeUndefined();
        expect(binarySearch(new Uint8Array([1]))).toBeUndefined();
        expect(binarySearch(new Set([1]))).toBeUndefined();
        expect(binarySearch(generate())).toBeUndefined();
        const array = Object.freeze([1, 2, 3]);
        expect(binarySearch({ array, value: 2, locale: "en-US" })).toBe(1);
        expect(array).toEqual([1, 2, 3]);
    });

    it("reads a hole as undefined", () => {
        const sparse: Array<number | undefined> = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            binarySearch({ array: sparse, value: undefined, locale: "en-US" }),
        ).toBe(1);
    });

    it("throws when by or numeric is invalid", () => {
        expect(() =>
            binarySearch({ array: [1], value: 1, by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            binarySearch({
                array: [1],
                value: 1,
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
    });
});
