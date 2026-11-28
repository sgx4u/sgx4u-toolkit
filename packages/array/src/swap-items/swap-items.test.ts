import { describe, expect, it } from "vitest";
import { swapItems } from "./swap-items.js";

const invalidInputs: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    [
        "a generator",
        (function* generate() {
            yield 1;
        })(),
    ],
];

describe("swapItems", () => {
    it("swaps two indexes", () => {
        expect(swapItems({ array: [1, 2, 3], first: 0, second: 2 })).toEqual([
            3, 2, 1,
        ]);
    });

    it("counts negative indexes from the end", () => {
        expect(swapItems({ array: [1, 2, 3], first: -1, second: 0 })).toEqual([
            3, 2, 1,
        ]);
    });

    it("returns a shallow copy when both indexes are the same", () => {
        const array = [1, 2, 3];
        const result = swapItems({ array, first: 1, second: 1 });

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
    });

    it("returns the original order after swapping twice", () => {
        const original = [1, 2, 3, 4];
        const once = swapItems({ array: original, first: 0, second: 3 });
        const twice = swapItems({
            array: once ?? [],
            first: 0,
            second: 3,
        });

        expect(twice).toEqual([...original]);
        expect(twice).not.toBe(original);
    });

    it("returns undefined for an out-of-range index", () => {
        expect(swapItems({ array: [1], first: 0, second: 1 })).toBeUndefined();
        expect(
            swapItems({ array: [1, 2], first: -3, second: 0 }),
        ).toBeUndefined();
        expect(
            swapItems({ array: [1], first: 0.5, second: 0 }),
        ).toBeUndefined();
        expect(swapItems({ array: [], first: 0, second: 0 })).toBeUndefined();
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(swapItems(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = swapItems({ array, first: 0, second: 2 });

        expect(result).toEqual([3, 2, 1]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = swapItems({ array, first: 0, second: 1 });

        expect(result).toEqual([undefined, 1, 3]);
        expect(0 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
