import { describe, expect, it } from "vitest";
import type { GetSortedLastInsertIndexParams } from "./get-sorted-last-insert-index.types.js";
import { getSortedLastInsertIndex } from "./get-sorted-last-insert-index.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("getSortedLastInsertIndex", () => {
    it("returns the first index whose item is strictly greater", () => {
        const params: GetSortedLastInsertIndexParams<number> = {
            array: [1, 2, 2, 3],
            value: 2,
            locale: "en-US",
        };
        expect(getSortedLastInsertIndex(params)).toBe(3);
        expect(
            getSortedLastInsertIndex({
                array: [1, 2, 3],
                value: 0,
                locale: "en-US",
            }),
        ).toBe(0);
        expect(
            getSortedLastInsertIndex({
                array: [1, 2, 3],
                value: 4,
                locale: "en-US",
            }),
        ).toBe(3);
    });

    it("compares extracted keys and uses numeric order", () => {
        expect(
            getSortedLastInsertIndex({
                array: [{ id: 1 }, { id: 3 }, { id: 3 }, { id: 5 }],
                value: { id: 3 },
                by: "id",
                locale: "en-US",
            }),
        ).toBe(3);
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                getSortedLastInsertIndex({
                    array: ["item1", "item2", "item2", "item10"],
                    value: "item2",
                    numeric: true,
                    locale,
                }),
            ).toBe(3);
        }
    });

    it("returns undefined for a non-array and does not mutate input", () => {
        expect(getSortedLastInsertIndex(null)).toBeUndefined();
        expect(getSortedLastInsertIndex({})).toBeUndefined();
        expect(getSortedLastInsertIndex("text")).toBeUndefined();
        expect(getSortedLastInsertIndex(new Uint8Array([1]))).toBeUndefined();
        expect(getSortedLastInsertIndex(new Set([1]))).toBeUndefined();
        expect(getSortedLastInsertIndex(generate())).toBeUndefined();
        const array = Object.freeze([1, 2, 2, 3]);
        expect(
            getSortedLastInsertIndex({ array, value: 2, locale: "en-US" }),
        ).toBe(3);
        expect(array).toEqual([1, 2, 2, 3]);
    });

    it("reads holes as undefined", () => {
        const sparse: number[] = [];
        sparse.length = 2;
        sparse[0] = 1;
        expect(
            getSortedLastInsertIndex({
                array: sparse,
                value: undefined as never,
                locale: "en-US",
            }),
        ).toBe(2);
    });

    it("throws when by or numeric is invalid", () => {
        expect(() =>
            getSortedLastInsertIndex({
                array: [1],
                value: 1,
                by: {} as never,
            }),
        ).toThrow(TypeError);
        expect(() =>
            getSortedLastInsertIndex({
                array: [1],
                value: 1,
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
    });
});
