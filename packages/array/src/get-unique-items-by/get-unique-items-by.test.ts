import { describe, expect, it } from "vitest";
import type { GetUniqueItemsByParams } from "./get-unique-items-by.types.js";
import { getUniqueItemsBy } from "./get-unique-items-by.js";

interface Row {
    id: number;
    name: string;
}

function* generate(): Generator<Row, void, unknown> {
    yield { id: 1, name: "a" };
}

function sparse(): Row[] {
    const array: Row[] = [];
    array[0] = { id: 1, name: "a" };
    array[2] = { id: 1, name: "c" };
    return array;
}

describe("getUniqueItemsBy", () => {
    it("keeps the first item for each key", () => {
        const rows: Row[] = [
            { id: 1, name: "a" },
            { id: 2, name: "b" },
            { id: 1, name: "c" },
        ];
        const params: GetUniqueItemsByParams<Row> = { array: rows, by: "id" };
        const result = getUniqueItemsBy(params);
        expect(result).toEqual([
            { id: 1, name: "a" },
            { id: 2, name: "b" },
        ]);
        expect(result).not.toBe(rows);
    });

    it("keeps the last item in the order of those last items", () => {
        expect(
            getUniqueItemsBy({
                array: [
                    { id: 1, name: "a" },
                    { id: 2, name: "b" },
                    { id: 1, name: "c" },
                ],
                by: "id",
                keep: "last",
            }),
        ).toEqual([
            { id: 2, name: "b" },
            { id: 1, name: "c" },
        ]);
    });

    it("treats NaN keys as equal and -0 keys as equal to 0", () => {
        expect(
            getUniqueItemsBy({
                array: [Number.NaN, 0, Number.NaN, -0],
                by: (item: number) => item,
            }),
        ).toEqual([Number.NaN, 0]);
    });

    it("returns an empty array for an empty array", () => {
        const array: Row[] = [];
        const result = getUniqueItemsBy({ array, by: "id" });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(getUniqueItemsBy(null)).toBeUndefined();
        expect(getUniqueItemsBy("text")).toBeUndefined();
        expect(getUniqueItemsBy(generate)).toBeUndefined();
        const invalidArrays = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const array of invalidArrays) {
            expect(
                getUniqueItemsBy({
                    array: array as never,
                    by: (item: unknown) => item,
                }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([
            { id: 1, name: "a" },
            { id: 1, name: "b" },
        ]);
        expect(getUniqueItemsBy({ array, by: "id" })).toEqual([
            { id: 1, name: "a" },
        ]);
        expect(array).toEqual([
            { id: 1, name: "a" },
            { id: 1, name: "b" },
        ]);
    });

    it("copies holes as undefined", () => {
        expect(getUniqueItemsBy({ array: sparse(), by: "id" })).toEqual([
            { id: 1, name: "a" },
            undefined,
        ]);
    });

    it("throws when by or keep is invalid", () => {
        expect(() => getUniqueItemsBy({ array: [{ id: 1 }] } as never)).toThrow(
            TypeError,
        );
        expect(() =>
            getUniqueItemsBy({
                array: [{ id: 1, name: "a" }],
                by: {} as never,
            }),
        ).toThrow(TypeError);
        expect(() =>
            getUniqueItemsBy({
                array: [{ id: 1, name: "a" }],
                by: "id",
                keep: "middle" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getUniqueItemsBy({ array: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });
});
