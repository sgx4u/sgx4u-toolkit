import { describe, expect, it } from "vitest";
import type { IsSortedParams } from "./is-sorted.types.js";
import { isSorted } from "./is-sorted.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("isSorted", () => {
    it("is true when each item is less than or equal to the next", () => {
        const params: IsSortedParams<number> = {
            array: [1, 2, 2, 3],
            locale: "en-US",
        };
        expect(isSorted(params)).toBe(true);
        expect(isSorted({ array: [1, 3, 2], locale: "en-US" })).toBe(false);
        expect(
            isSorted({
                array: [3, 2, 2, 1],
                direction: "descending",
                locale: "en-US",
            }),
        ).toBe(true);
    });

    it("accepts mixed directions and numeric order for en-US and en-IN", () => {
        const array = [
            { group: "a", label: "item2" },
            { group: "a", label: "item10" },
            { group: "b", label: "item1" },
        ];
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                isSorted({
                    array,
                    keys: [
                        { by: "group", direction: "ascending" },
                        { by: "label", direction: "ascending", numeric: true },
                    ],
                    locale,
                }),
            ).toBe(true);
            expect(
                isSorted({
                    array: ["item1", "item10", "item2"],
                    numeric: true,
                    locale,
                }),
            ).toBe(false);
            expect(
                isSorted({
                    array: ["item1", "item10", "item2"],
                    numeric: false,
                    locale,
                }),
            ).toBe(true);
        }
    });

    it("uses nulls first and last", () => {
        expect(
            isSorted({
                array: [null, 1, 2],
                nulls: "first",
                locale: "en-US",
            }),
        ).toBe(true);
        expect(
            isSorted({
                array: [1, 2, null, Number.NaN],
                nulls: "last",
                locale: "en-US",
            }),
        ).toBe(true);
        expect(
            isSorted({
                array: [null, 1],
                nulls: "last",
                locale: "en-US",
            }),
        ).toBe(false);
        expect(
            isSorted({
                array: [2, 1, null],
                direction: "descending",
                nulls: "last",
                locale: "en-US",
            }),
        ).toBe(true);
    });

    it("treats an empty or single-item array as sorted even when keys are invalid", () => {
        expect(isSorted({ array: [] })).toBe(true);
        expect(isSorted({ array: [1], keys: "bad" as never })).toBe(true);
        expect(isSorted({ array: [], direction: "sideways" as never })).toBe(
            true,
        );
    });

    it("returns false for invalid input and never throws", () => {
        const invalidValues = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const value of invalidValues) {
            expect(isSorted(value)).toBe(false);
        }
        expect(
            isSorted({ array: [1, 2], keys: "bad" as never, locale: "en-US" }),
        ).toBe(false);
        expect(
            isSorted({
                array: [1, 2],
                direction: "sideways" as never,
                locale: "en-US",
            }),
        ).toBe(false);
        expect(
            isSorted({
                array: [1, 2],
                nulls: "middle" as never,
                locale: "en-US",
            }),
        ).toBe(false);
        expect(
            isSorted({
                array: ["a", "b"],
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toBe(false);
        expect(isSorted(generate)).toBe(false);
    });

    it("does not mutate a frozen array and reads holes as undefined", () => {
        const array = Object.freeze([1, 2, 3]);
        expect(isSorted({ array, locale: "en-US" })).toBe(true);
        expect(array).toEqual([1, 2, 3]);
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(
            isSorted({ array: sparse, nulls: "last", locale: "en-US" }),
        ).toBe(false);
        expect(
            isSorted({
                array: [1, 3, undefined],
                nulls: "last",
                locale: "en-US",
            }),
        ).toBe(true);
    });
});
