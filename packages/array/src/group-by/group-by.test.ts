import { describe, expect, it } from "vitest";
import type { GroupByParams } from "./group-by.types.js";
import { groupBy } from "./group-by.js";

function* generate(): Generator<string, void, unknown> {
    yield "a";
}

function sparse(): string[] {
    const array: string[] = [];
    array[0] = "a";
    array[2] = "a";
    return array;
}

describe("groupBy", () => {
    it("builds a record in first-seen key order", () => {
        const params: GroupByParams<string> = {
            array: ["b", "a", "b"],
            by: (item) => item,
        };
        const result = groupBy(params);
        expect(result).toEqual({ b: ["b", "b"], a: ["a"] });
        expect(Object.keys(result ?? {})).toEqual(["b", "a"]);
    });

    it("keeps original keys in a map, including distinct objects", () => {
        const left = { id: 1 };
        const right = { id: 2 };
        const result = groupBy({
            array: [left, right, left],
            by: (item: { id: number }) => item,
            asMap: true,
        });
        expect(result).toBeInstanceOf(Map);
        expect(result?.get(left)).toEqual([left, left]);
        expect(result?.get(right)).toEqual([right]);
        expect(result?.size).toBe(2);
    });

    it("collides distinct objects on the string key [object Object]", () => {
        const left = { id: 1 };
        const right = { id: 2 };
        expect(
            groupBy({
                array: [left, right],
                by: (item: { id: number }) => item,
            }),
        ).toEqual({ "[object Object]": [left, right] });
    });

    it("groups NaN together and -0 with 0", () => {
        expect(
            groupBy({
                array: [Number.NaN, 0, -0, Number.NaN],
                by: (item: number) => item,
            }),
        ).toEqual({
            NaN: [Number.NaN, Number.NaN],
            0: [0, -0],
        });
        const mapped = groupBy({
            array: [Number.NaN, Number.NaN, 0, -0],
            by: (item: number) => item,
            asMap: true,
        });
        expect(mapped?.get(Number.NaN)).toEqual([Number.NaN, Number.NaN]);
        expect(mapped?.get(0)).toEqual([0, -0]);
        expect(mapped?.get(-0)).toEqual([0, -0]);
    });

    it("returns an empty record or map for an empty array", () => {
        const array: string[] = [];
        const record = groupBy({ array, by: (item) => item });
        const mapped = groupBy({ array, by: (item) => item, asMap: true });
        expect(record).toEqual({});
        expect(mapped).toEqual(new Map());
        expect(record).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(groupBy(null)).toBeUndefined();
        expect(groupBy("text")).toBeUndefined();
        expect(groupBy(generate)).toBeUndefined();
        const invalidArrays = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set(["a"]),
            generate(),
        ];
        for (const array of invalidArrays) {
            expect(
                groupBy({ array: array as never, by: (item: unknown) => item }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze(["a", "b", "a"]);
        const result = groupBy({ array, by: (item) => item });
        expect(result).toEqual({ a: ["a", "a"], b: ["b"] });
        expect(array).toEqual(["a", "b", "a"]);
    });

    it("copies holes as undefined", () => {
        expect(
            groupBy({ array: sparse(), by: (item) => item ?? "hole" }),
        ).toEqual({ a: ["a", "a"], hole: [undefined] });
    });

    it("throws when by is missing or not an iteratee", () => {
        expect(() => groupBy({ array: ["a"] } as never)).toThrow(TypeError);
        expect(() => groupBy({ array: ["a"], by: {} as never })).toThrow(
            TypeError,
        );
        expect(() =>
            groupBy({ array: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });
});
