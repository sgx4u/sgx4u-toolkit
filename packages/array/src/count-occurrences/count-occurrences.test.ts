import { describe, expect, it } from "vitest";
import type { CountOccurrencesParams } from "./count-occurrences.types.js";
import { countOccurrences } from "./count-occurrences.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 1;
    return array;
}

describe("countOccurrences", () => {
    it("counts items equal to value", () => {
        const params: CountOccurrencesParams<number> = {
            array: [1, 2, 1, 1],
            value: 1,
        };
        expect(countOccurrences(params)).toBe(3);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            countOccurrences({
                array: [Number.NaN, 1, Number.NaN],
                value: Number.NaN,
            }),
        ).toBe(2);
        expect(countOccurrences({ array: [0, -0, 1], value: 0 })).toBe(2);
        expect(countOccurrences({ array: [0, -0, 1], value: -0 })).toBe(2);
    });

    it("uses a custom equals function", () => {
        expect(
            countOccurrences({
                array: ["a", "b", "A"],
                value: "a",
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toBe(2);
    });

    it("returns 0 for an empty array or no matches", () => {
        expect(countOccurrences({ array: [], value: 1 })).toBe(0);
        expect(countOccurrences({ array: [1, 2], value: 3 })).toBe(0);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(countOccurrences(null)).toBeUndefined();
        expect(countOccurrences("text")).toBeUndefined();
        expect(countOccurrences(generate)).toBeUndefined();
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
                countOccurrences({ array: array as never, value: 1 }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 1, 2]);
        expect(countOccurrences({ array, value: 1 })).toBe(2);
        expect(array).toEqual([1, 1, 2]);
    });

    it("counts holes as undefined", () => {
        expect(countOccurrences({ array: sparse(), value: undefined })).toBe(1);
        expect(countOccurrences({ array: sparse(), value: 1 })).toBe(2);
    });

    it("throws when equals is not a function", () => {
        expect(() =>
            countOccurrences({ array: [1], value: 1, equals: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            countOccurrences({
                array: "text" as never,
                value: 1,
                equals: 1 as never,
            }),
        ).toThrow(TypeError);
    });
});
