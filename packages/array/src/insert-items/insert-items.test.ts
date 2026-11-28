import { describe, expect, it } from "vitest";
import { insertItems } from "./insert-items.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

const invalidArrays: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    ["a generator", generate()],
];

describe("insertItems", () => {
    it("inserts items at an index", () => {
        expect(insertItems({ array: [1, 4], index: 1, items: [2, 3] })).toEqual(
            [1, 2, 3, 4],
        );
    });

    it("appends when the index equals the length", () => {
        expect(insertItems({ array: [1], index: 1, items: [2, 3] })).toEqual([
            1, 2, 3,
        ]);
    });

    it("counts a negative index from the end", () => {
        expect(
            insertItems({ array: [1, 2, 3], index: -1, items: [8, 9] }),
        ).toEqual([1, 2, 8, 9, 3]);
    });

    it("returns a shallow copy when items is empty", () => {
        const array = [1, 2];
        const result = insertItems({ array, index: 1, items: [] });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
    });

    it("inserts into an empty array at index 0", () => {
        expect(insertItems({ array: [], index: 0, items: [1, 2] })).toEqual([
            1, 2,
        ]);
    });

    it("returns undefined for an out-of-range or non-integer index", () => {
        expect(
            insertItems({ array: [1], index: 2, items: [2] }),
        ).toBeUndefined();
        expect(
            insertItems({ array: [1], index: 0.5, items: [2] }),
        ).toBeUndefined();
        expect(
            insertItems({ array: [], index: 1, items: [1] }),
        ).toBeUndefined();
    });

    it("returns undefined for a non-object", () => {
        expect(insertItems(null as never)).toBeUndefined();
        expect(insertItems("text" as never)).toBeUndefined();
        expect(insertItems(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and items is an array",
        (_label, array) => {
            expect(
                insertItems({ array: array as never, index: 0, items: [1] }),
            ).toBeUndefined();
        },
    );

    it("throws when items is not an array", () => {
        expect(() => insertItems({} as never)).toThrow(TypeError);
        expect(() => insertItems(new Uint8Array() as never)).toThrow(TypeError);
        expect(() => insertItems(new Set() as never)).toThrow(TypeError);
        expect(() => insertItems(generate() as never)).toThrow(TypeError);
        expect(() =>
            insertItems({ array: [1], index: 0, items: "no" as never }),
        ).toThrow('`items` must be an array; received "no".');
        expect(() => insertItems({ array: [1], index: 0 } as never)).toThrow(
            TypeError,
        );
        expect(() => insertItems({ items: "no" } as never)).toThrow(TypeError);
    });

    it("returns undefined when array is not an array and items is an array", () => {
        expect(
            insertItems({ array: "no", index: 0, items: [1] } as never),
        ).toBeUndefined();
    });

    it("does not mutate a frozen array or the items array", () => {
        const array = Object.freeze([1, 2, 3]);
        const items = Object.freeze([8, 9]);
        const result = insertItems({ array, index: 1, items });

        expect(result).toEqual([1, 8, 9, 2, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
        expect(items).toEqual([8, 9]);
    });

    it("treats sparse holes as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const items = [4, , 6] as number[];
        const result = insertItems({ array, index: 1, items });

        expect(result).toEqual([1, 4, undefined, 6, undefined, 3]);
        expect(1 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
