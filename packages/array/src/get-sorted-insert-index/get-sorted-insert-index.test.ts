import { describe, expect, it } from "vitest";
import type { GetSortedInsertIndexParams } from "./get-sorted-insert-index.types.js";
import { getSortedInsertIndex } from "./get-sorted-insert-index.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("getSortedInsertIndex", () => {
    it("returns the lowest index that keeps ascending order", () => {
        const params: GetSortedInsertIndexParams<number> = {
            array: [1, 2, 2, 3],
            value: 2,
            locale: "en-US",
        };
        expect(getSortedInsertIndex(params)).toBe(1);
        expect(
            getSortedInsertIndex({
                array: [1, 2, 3],
                value: 0,
                locale: "en-US",
            }),
        ).toBe(0);
        expect(
            getSortedInsertIndex({
                array: [1, 2, 3],
                value: 4,
                locale: "en-US",
            }),
        ).toBe(3);
        expect(
            getSortedInsertIndex({ array: [], value: 1, locale: "en-US" }),
        ).toBe(0);
    });

    it("compares extracted keys", () => {
        const array = [{ id: 1 }, { id: 3 }, { id: 5 }];
        expect(
            getSortedInsertIndex({
                array,
                value: { id: 4 },
                by: "id",
                locale: "en-US",
            }),
        ).toBe(2);
        expect(
            getSortedInsertIndex({
                array,
                value: { id: 3 },
                by: "id",
                locale: "en-US",
            }),
        ).toBe(1);
    });

    it("uses numeric order for en-US and en-IN", () => {
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                getSortedInsertIndex({
                    array: ["item1", "item2", "item10"],
                    value: "item3",
                    numeric: true,
                    locale,
                }),
            ).toBe(2);
        }
    });

    it("places a nullish value with nulls last", () => {
        expect(
            getSortedInsertIndex({
                array: [1, 2, null],
                value: null,
                locale: "en-US",
            }),
        ).toBe(2);
        expect(
            getSortedInsertIndex({
                array: [1, 2],
                value: Number.NaN,
                locale: "en-US",
            }),
        ).toBe(2);
    });

    it("returns undefined for a non-array and does not mutate input", () => {
        expect(getSortedInsertIndex(null)).toBeUndefined();
        expect(getSortedInsertIndex({})).toBeUndefined();
        expect(getSortedInsertIndex("text")).toBeUndefined();
        expect(getSortedInsertIndex(new Uint8Array([1]))).toBeUndefined();
        expect(getSortedInsertIndex(new Set([1]))).toBeUndefined();
        expect(getSortedInsertIndex(generate())).toBeUndefined();
        const array = Object.freeze([1, 3, 5]);
        expect(getSortedInsertIndex({ array, value: 4, locale: "en-US" })).toBe(
            2,
        );
        expect(array).toEqual([1, 3, 5]);
    });

    it("reads holes as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            getSortedInsertIndex({
                array: sparse,
                value: undefined as never,
                locale: "en-US",
            }),
        ).toBe(1);
    });

    it("throws when by, numeric, or locale is invalid", () => {
        expect(() =>
            getSortedInsertIndex({
                array: [1],
                value: 1,
                by: {} as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
        expect(() =>
            getSortedInsertIndex({
                array: [1],
                value: 1,
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
        expect(() =>
            getSortedInsertIndex({
                array: "text" as never,
                value: 1,
                by: null as never,
            }),
        ).toThrow(TypeError);
    });
});
