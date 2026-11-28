import { describe, expect, it } from "vitest";
import { updateAt } from "./update-at.js";

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

describe("updateAt", () => {
    it("replaces an item with a value", () => {
        expect(updateAt({ array: [1, 2, 3], index: 1, updater: 9 })).toEqual([
            1, 9, 3,
        ]);
    });

    it("calls an updater function with the item and index", () => {
        const seen: Array<{ item: number; index: number }> = [];
        const result = updateAt({
            array: [1, 2, 3],
            index: -1,
            updater: (item, index) => {
                seen.push({ item, index });
                return item * 10;
            },
        });

        expect(result).toEqual([1, 2, 30]);
        expect(seen).toEqual([{ item: 3, index: 2 }]);
    });

    it("calls a function value instead of storing it", () => {
        const updater = (item: number) => item + 1;
        expect(updateAt({ array: [1], index: 0, updater })).toEqual([2]);
    });

    it("returns undefined for an out-of-range or non-integer index", () => {
        expect(updateAt({ array: [1], index: 1, updater: 2 })).toBeUndefined();
        expect(updateAt({ array: [1], index: -2, updater: 2 })).toBeUndefined();
        expect(
            updateAt({ array: [1], index: 0.4, updater: 2 }),
        ).toBeUndefined();
        expect(updateAt({ array: [], index: 0, updater: 1 })).toBeUndefined();
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(updateAt(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = updateAt({ array, index: 0, updater: 9 });

        expect(result).toEqual([9, 2, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = updateAt({
            array,
            index: 1,
            updater: (item) => (item === undefined ? 0 : item),
        });

        expect(result).toEqual([1, 0, 3]);
        expect(1 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
