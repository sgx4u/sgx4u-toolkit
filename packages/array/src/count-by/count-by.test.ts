import { describe, expect, it } from "vitest";
import type { CountByParams } from "./count-by.types.js";
import { countBy } from "./count-by.js";

function* generate(): Generator<string, void, unknown> {
    yield "a";
}

function sparse(): string[] {
    const array: string[] = [];
    array[0] = "a";
    array[2] = "a";
    return array;
}

describe("countBy", () => {
    it("counts string keys in first-seen order", () => {
        const params: CountByParams<string> = {
            array: ["b", "a", "b"],
            by: (item) => item,
        };
        const result = countBy(params);
        expect(result).toEqual({ b: 2, a: 1 });
        expect(Object.keys(result ?? {})).toEqual(["b", "a"]);
    });

    it("counts NaN together, -0 with 0, and objects under one key", () => {
        expect(
            countBy({
                array: [Number.NaN, 0, -0, Number.NaN],
                by: (item: number) => item,
            }),
        ).toEqual({ NaN: 2, 0: 2 });
        const left = { id: 1 };
        const right = { id: 2 };
        expect(
            countBy({
                array: [left, right],
                by: (item: { id: number }) => item,
            }),
        ).toEqual({ "[object Object]": 2 });
    });

    it("returns an empty record for an empty array", () => {
        const array: string[] = [];
        const result = countBy({ array, by: (item) => item });
        expect(result).toEqual({});
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(countBy(null)).toBeUndefined();
        expect(countBy("text")).toBeUndefined();
        expect(countBy(generate)).toBeUndefined();
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
                countBy({ array: array as never, by: (item: unknown) => item }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze(["a", "a"]);
        expect(countBy({ array, by: "length" })).toEqual({ 1: 2 });
        expect(array).toEqual(["a", "a"]);
    });

    it("copies holes as undefined", () => {
        expect(countBy({ array: sparse(), by: (item) => item })).toEqual({
            a: 2,
            undefined: 1,
        });
    });

    it("throws when by is missing or not an iteratee", () => {
        expect(() => countBy({ array: ["a"] } as never)).toThrow(TypeError);
        expect(() => countBy({ array: ["a"], by: {} as never })).toThrow(
            TypeError,
        );
        expect(() =>
            countBy({ array: "text" as never, by: null as never }),
        ).toThrow(TypeError);
    });
});
