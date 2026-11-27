import { describe, expect, it } from "vitest";
import type { SortByParams } from "./sort-by.types.js";
import { sortBy } from "./sort-by.js";

interface Row {
    group: string;
    score: number;
    order: number;
}

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

describe("sortBy", () => {
    it("sorts by later keys after earlier keys tie", () => {
        const rows: Row[] = [
            { group: "b", score: 1, order: 1 },
            { group: "a", score: 2, order: 2 },
            { group: "b", score: 3, order: 3 },
            { group: "a", score: 1, order: 4 },
        ];
        const params: SortByParams<Row> = {
            array: rows,
            keys: [
                { by: "group", direction: "ascending" },
                { by: "score", direction: "descending" },
            ],
            locale: "en-US",
        };
        const result = sortBy(params);
        expect(result?.map((row) => row.order)).toEqual([2, 4, 3, 1]);
        expect(result).not.toBe(rows);
    });

    it("keeps the original order when keys are equal", () => {
        const array = [
            { name: "same", order: 1 },
            { name: "same", order: 2 },
            { name: "same", order: 3 },
        ];
        const result = sortBy({
            array,
            keys: ["name"],
            locale: "en-US",
        });
        expect(result?.map((row) => row.order)).toEqual([1, 2, 3]);
    });

    it("places nullish and NaN keys first or last without flipping for direction", () => {
        expect(
            sortBy({
                array: [1, null, 3, undefined, 2],
                keys: [(item: number | null | undefined) => item],
                nulls: "first",
                locale: "en-US",
            }),
        ).toEqual([null, undefined, 1, 2, 3]);
        expect(
            sortBy({
                array: [1, null, 3, undefined, 2, Number.NaN],
                keys: [(item: number | null | undefined) => item],
                nulls: "last",
                locale: "en-US",
            }),
        ).toEqual([1, 2, 3, null, undefined, Number.NaN]);
        expect(
            sortBy({
                array: [1, null, 2],
                keys: [
                    {
                        by: (item: number | null) => item,
                        direction: "descending",
                    },
                ],
                nulls: "last",
                locale: "en-US",
            }),
        ).toEqual([2, 1, null]);
        expect(
            sortBy({
                array: [1, null, 2],
                keys: [
                    {
                        by: (item: number | null) => item,
                        direction: "descending",
                    },
                ],
                nulls: "first",
                locale: "en-US",
            }),
        ).toEqual([null, 2, 1]);
    });

    it('sorts "item2" before "item10" for en-US and en-IN when numeric is true', () => {
        for (const locale of ["en-US", "en-IN"] as const) {
            expect(
                sortBy({
                    array: ["item10", "item2", "item1"],
                    keys: [(item: string) => item],
                    numeric: true,
                    locale,
                }),
            ).toEqual(["item1", "item2", "item10"]);
        }
        expect(
            sortBy({
                array: ["item10", "item2"],
                keys: [(item: string) => item],
                numeric: false,
                locale: "en-US",
            }),
        ).toEqual(["item10", "item2"]);
    });

    it("returns a shallow copy when keys is empty", () => {
        const array = [{ name: "b" }, { name: "a" }];
        const result = sortBy({ array, keys: [], locale: "en-US" });
        expect(result).toEqual(array);
        expect(result).not.toBe(array);
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(sortBy({ array: sparse, keys: [], locale: "en-US" })).toEqual([
            1,
            undefined,
            3,
        ]);
    });

    it("returns an empty array for an empty array", () => {
        const array: number[] = [];
        const result = sortBy({
            array,
            keys: [(item) => item],
            locale: "en-US",
        });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-array and does not mutate a frozen array", () => {
        expect(sortBy(null)).toBeUndefined();
        expect(sortBy("text")).toBeUndefined();
        expect(sortBy(generate)).toBeUndefined();
        expect(
            sortBy({ array: "text" as never, keys: [(item: unknown) => item] }),
        ).toBeUndefined();
        expect(
            sortBy({
                array: new Uint8Array([1]) as never,
                keys: [(item: unknown) => item],
            }),
        ).toBeUndefined();
        expect(
            sortBy({
                array: new Set([1]) as never,
                keys: [(item: unknown) => item],
            }),
        ).toBeUndefined();
        expect(
            sortBy({
                array: generate() as never,
                keys: [(item: unknown) => item],
            }),
        ).toBeUndefined();
        expect(sortBy({ array: {} as never, keys: ["name"] })).toBeUndefined();
        const array = Object.freeze([{ name: "b" }, { name: "a" }]);
        expect(sortBy({ array, keys: ["name"], locale: "en-US" })).toEqual([
            { name: "a" },
            { name: "b" },
        ]);
        expect(array).toEqual([{ name: "b" }, { name: "a" }]);
    });

    it("reads each key once with the original index", () => {
        const indexes: number[] = [];
        sortBy({
            array: ["b", "c", "a"],
            keys: [
                (item: string, index: number) => {
                    indexes.push(index);
                    return item;
                },
            ],
            locale: "en-US",
        });
        expect(indexes).toEqual([0, 1, 2]);
    });

    it("throws when keys or a sort option is invalid", () => {
        expect(() => sortBy({ array: [1] } as never)).toThrow(TypeError);
        expect(() => sortBy({ array: [1], keys: "name" as never })).toThrow(
            TypeError,
        );
        expect(() =>
            sortBy({ array: "text" as never, keys: "name" as never }),
        ).toThrow(TypeError);
        expect(() =>
            sortBy({
                array: [1, 2],
                keys: [(item: number) => item],
                direction: "sideways" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            sortBy({
                array: [1, 2],
                keys: [
                    {
                        by: (item: number) => item,
                        direction: "sideways" as never,
                    },
                ],
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            sortBy({
                array: [1, 2],
                keys: [(item: number) => item],
                sensitivity: "high" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            sortBy({
                array: [1, 2],
                keys: [(item: number) => item],
                nulls: "middle" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            sortBy({
                array: [1, 2],
                keys: [(item: number) => item],
                numeric: "yes" as never,
                locale: "en-US",
            }),
        ).toThrow(TypeError);
        expect(() =>
            sortBy({
                array: ["a"],
                keys: [(item: string) => item],
                locale: "!!!" as never,
            }),
        ).toThrow(RangeError);
    });
});
