import { describe, expect, it } from "vitest";
import { intersperse } from "./intersperse.js";

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

describe("intersperse", () => {
    it("inserts the separator between items", () => {
        expect(intersperse({ array: [1, 2, 3], separator: 0 })).toEqual([
            1, 0, 2, 0, 3,
        ]);
    });

    it("accepts a separator of a different type", () => {
        expect(intersperse({ array: [1, 2], separator: "and" })).toEqual([
            1,
            "and",
            2,
        ]);
    });

    it("returns a shallow copy for an empty array or one item", () => {
        const single = [1];
        const empty: number[] = [];
        const singleResult = intersperse({ array: single, separator: 0 });
        const emptyResult = intersperse({ array: empty, separator: 0 });

        expect(singleResult).toEqual([1]);
        expect(singleResult).not.toBe(single);
        expect(emptyResult).toEqual([]);
        expect(emptyResult).not.toBe(empty);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(intersperse(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const item = { id: 1 };
        const array = Object.freeze([item, item]);
        const separator = { id: 0 };
        const result = intersperse({ array, separator });

        expect(result).toEqual([item, separator, item]);
        expect(result).not.toBe(array);
        expect(result?.[0]).toBe(item);
        expect(result?.[1]).toBe(separator);
        expect(array).toEqual([item, item]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = intersperse({ array, separator: 0 });

        expect(result).toEqual([1, 0, undefined, 0, 3]);
        expect(2 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
