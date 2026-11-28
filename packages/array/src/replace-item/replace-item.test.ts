import { describe, expect, it } from "vitest";
import { replaceItem } from "./replace-item.js";

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

describe("replaceItem", () => {
    it("replaces the first match", () => {
        expect(
            replaceItem({ array: [1, 2, 1], item: 1, replacement: 9 }),
        ).toEqual([9, 2, 1]);
    });

    it("replaces every match when all is true", () => {
        expect(
            replaceItem({
                array: [1, 2, 1],
                item: 1,
                replacement: 9,
                all: true,
            }),
        ).toEqual([9, 2, 9]);
    });

    it("treats NaN as equal to NaN", () => {
        expect(
            replaceItem({
                array: [Number.NaN, 1],
                item: Number.NaN,
                replacement: 0,
            }),
        ).toEqual([0, 1]);
    });

    it("uses a custom equals function", () => {
        expect(
            replaceItem({
                array: ["a", "B"],
                item: "b",
                replacement: "c",
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["a", "c"]);
    });

    it("returns a shallow copy when nothing matches", () => {
        const array = [1, 2];
        const result = replaceItem({ array, item: 9, replacement: 0 });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
        expect(replaceItem({ array: [], item: 1, replacement: 2 })).toEqual([]);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(replaceItem(value as never)).toBeUndefined();
    });

    it("throws when equals is present and is not a function", () => {
        expect(() =>
            replaceItem({
                array: [1],
                item: 1,
                replacement: 2,
                equals: "no" as never,
            }),
        ).toThrow(TypeError);
        expect(() => replaceItem({ equals: true } as never)).toThrow(TypeError);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 1]);
        const result = replaceItem({ array, item: 1, replacement: 9 });

        expect(result).toEqual([9, 2, 1]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 1]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = replaceItem({
            array,
            item: undefined as unknown as number,
            replacement: 0,
        });

        expect(result).toEqual([1, 0, 3]);
        expect(1 in array).toBe(false);
    });
});
