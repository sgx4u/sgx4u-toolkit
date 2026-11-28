import { describe, expect, it } from "vitest";
import type { InsertSortedParams } from "./insert-sorted.types.js";
import { insertSorted } from "./insert-sorted.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("insertSorted", () => {
    it("inserts at the bisect-left index in a new array", () => {
        const array = [1, 2, 2, 4];
        const params: InsertSortedParams<number> = {
            array,
            value: 2,
            locale: "en-US",
        };
        const result = insertSorted(params);
        expect(result).toEqual([1, 2, 2, 2, 4]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 2, 4]);
    });

    it("inserts by a key and uses numeric order", () => {
        const array = [{ id: 1 }, { id: 3 }, { id: 5 }];
        expect(
            insertSorted({
                array,
                value: { id: 4 },
                by: "id",
                locale: "en-US",
            }),
        ).toEqual([{ id: 1 }, { id: 3 }, { id: 4 }, { id: 5 }]);
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                insertSorted({
                    array: ["item1", "item2", "item10"],
                    value: "item3",
                    numeric: true,
                    locale,
                }),
            ).toEqual(["item1", "item2", "item3", "item10"]);
        }
    });

    it("returns a one-item array for an empty array", () => {
        const array: number[] = [];
        const result = insertSorted({ array, value: 1, locale: "en-US" });
        expect(result).toEqual([1]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-array and does not mutate a frozen array", () => {
        expect(insertSorted(null)).toBeUndefined();
        expect(insertSorted({})).toBeUndefined();
        expect(insertSorted("text")).toBeUndefined();
        expect(insertSorted(new Uint8Array([1]))).toBeUndefined();
        expect(insertSorted(new Set([1]))).toBeUndefined();
        expect(insertSorted(generate())).toBeUndefined();
        const array = Object.freeze([1, 3, 5]);
        expect(insertSorted({ array, value: 4, locale: "en-US" })).toEqual([
            1, 3, 4, 5,
        ]);
        expect(array).toEqual([1, 3, 5]);
    });

    it("reads holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            insertSorted({ array: sparse, value: 2, locale: "en-US" }),
        ).toEqual([1, 2, undefined, 3]);
    });

    it("throws when by or numeric is invalid", () => {
        expect(() =>
            insertSorted({ array: [1], value: 1, by: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            insertSorted({
                array: [1],
                value: 1,
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
    });
});
