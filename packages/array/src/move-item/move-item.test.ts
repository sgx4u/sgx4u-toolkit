import { describe, expect, it } from "vitest";
import { moveItem } from "./move-item.js";

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

describe("moveItem", () => {
    it("moves the first item to the last result index", () => {
        expect(moveItem({ array: [1, 2, 3, 4], from: 0, to: 3 })).toEqual([
            2, 3, 4, 1,
        ]);
    });

    it("moves the last item to the start", () => {
        expect(moveItem({ array: [1, 2, 3, 4], from: 3, to: 0 })).toEqual([
            4, 1, 2, 3,
        ]);
    });

    it("counts negative indexes from the end", () => {
        expect(moveItem({ array: [1, 2, 3], from: -1, to: 0 })).toEqual([
            3, 1, 2,
        ]);
        expect(moveItem({ array: [1, 2, 3], from: 0, to: -1 })).toEqual([
            2, 3, 1,
        ]);
    });

    it("returns a shallow copy when from and to are the same", () => {
        const array = [1, 2, 3];
        const result = moveItem({ array, from: 1, to: 1 });

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for an empty array", () => {
        expect(moveItem({ array: [], from: 0, to: 0 })).toBeUndefined();
    });

    it("returns undefined when either index is out of range", () => {
        expect(moveItem({ array: [1, 2], from: 2, to: 0 })).toBeUndefined();
        expect(moveItem({ array: [1, 2], from: 0, to: 2 })).toBeUndefined();
        expect(moveItem({ array: [1, 2], from: -3, to: 0 })).toBeUndefined();
        expect(moveItem({ array: [1], from: 0.2, to: 0 })).toBeUndefined();
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(moveItem(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3, 4]);
        const result = moveItem({ array, from: 0, to: 3 });

        expect(result).toEqual([2, 3, 4, 1]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3, 4]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = moveItem({ array, from: 1, to: 0 });

        expect(result).toEqual([undefined, 1, 3]);
        expect(0 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
