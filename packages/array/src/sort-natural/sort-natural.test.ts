import { describe, expect, it } from "vitest";
import type { SortNaturalParams } from "./sort-natural.types.js";
import { sortNatural } from "./sort-natural.js";

function* generate(): Generator<string, void, unknown> {
    yield "a";
}

describe("sortNatural", () => {
    it('sorts "item2" before "item10" for en-US and en-IN', () => {
        for (const locale of ["en-US", "en-IN"] as const) {
            const params: SortNaturalParams<string> = {
                array: ["item10", "item2", "item1"],
                locale,
            };
            expect(sortNatural(params)).toEqual(["item1", "item2", "item10"]);
        }
    });

    it("sorts real numbers numerically and keeps a stable order", () => {
        expect(sortNatural({ array: [10, 2, 2], locale: "en-US" })).toEqual([
            2, 2, 10,
        ]);
        const array = [
            { label: "item10", order: 1 },
            { label: "item2", order: 2 },
            { label: "item2", order: 3 },
        ];
        expect(
            sortNatural({
                array,
                by: "label",
                locale: "en-US",
            })?.map((row) => row.order),
        ).toEqual([2, 3, 1]);
    });

    it("reverses direction and keeps nulls at the requested end", () => {
        expect(
            sortNatural({
                array: ["b", "a", "c"],
                direction: "descending",
                locale: "en-US",
            }),
        ).toEqual(["c", "b", "a"]);
        expect(
            sortNatural({
                array: ["b", null, "a"],
                nulls: "first",
                locale: "en-US",
            }),
        ).toEqual([null, "a", "b"]);
        expect(
            sortNatural({
                array: ["a", null, "b"],
                direction: "descending",
                nulls: "last",
                locale: "en-US",
            }),
        ).toEqual(["b", "a", null]);
    });

    it("returns a new empty array for an empty array", () => {
        const array: string[] = [];
        const result = sortNatural({ array, locale: "en-US" });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-array and does not mutate input", () => {
        expect(sortNatural(null)).toBeUndefined();
        expect(sortNatural("text")).toBeUndefined();
        expect(sortNatural({})).toBeUndefined();
        expect(sortNatural(new Uint8Array([1]))).toBeUndefined();
        expect(sortNatural(new Set(["a"]))).toBeUndefined();
        expect(sortNatural(generate())).toBeUndefined();
        const array = Object.freeze(["b", "a"]);
        expect(sortNatural({ array, locale: "en-US" })).toEqual(["a", "b"]);
        expect(array).toEqual(["b", "a"]);
    });

    it("reads holes as undefined and places them last by default", () => {
        const sparse: string[] = [];
        sparse[0] = "b";
        sparse[2] = "a";
        expect(sortNatural({ array: sparse, locale: "en-US" })).toEqual([
            "a",
            "b",
            undefined,
        ]);
    });

    it("throws when direction, nulls, locale, or by is invalid", () => {
        expect(() =>
            sortNatural({
                array: ["a", "b"],
                direction: "sideways" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            sortNatural({
                array: ["a"],
                nulls: "middle" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            sortNatural({ array: ["a"], by: {} as never, locale: "en-US" }),
        ).toThrow(TypeError);
        expect(() =>
            sortNatural({
                array: "text" as never,
                direction: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
