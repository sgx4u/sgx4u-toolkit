import { describe, expect, it } from "vitest";
import { toggleItem } from "./toggle-item.js";

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

describe("toggleItem", () => {
    it("removes every equal item", () => {
        expect(toggleItem({ array: [1, 2, 2, 3], item: 2 })).toEqual([1, 3]);
    });

    it("appends an absent item", () => {
        expect(toggleItem({ array: [1, 3], item: 2 })).toEqual([1, 3, 2]);
    });

    it("inserts an absent item at the start", () => {
        expect(
            toggleItem({ array: [1, 3], item: 2, placement: "start" }),
        ).toEqual([2, 1, 3]);
    });

    it("inserts into an empty array", () => {
        expect(toggleItem({ array: [], item: 1 })).toEqual([1]);
        expect(toggleItem({ array: [], item: 1, placement: "start" })).toEqual([
            1,
        ]);
    });

    it("treats NaN as equal to NaN and removes it", () => {
        expect(
            toggleItem({ array: [Number.NaN, 1], item: Number.NaN }),
        ).toEqual([1]);
    });

    it("uses a custom equals function", () => {
        expect(
            toggleItem({
                array: ["a", "B"],
                item: "b",
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["a"]);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(toggleItem(value as never)).toBeUndefined();
    });

    it("throws when placement is unknown", () => {
        expect(() =>
            toggleItem({ array: [1], item: 1, placement: "middle" as never }),
        ).toThrow(RangeError);
        expect(() => toggleItem({ placement: "middle" } as never)).toThrow(
            '`placement` must be "start" or "end"; received "middle".',
        );
    });

    it("throws when equals is present and is not a function", () => {
        expect(() =>
            toggleItem({ array: [1], item: 1, equals: "no" as never }),
        ).toThrow(TypeError);
        expect(() => toggleItem({ equals: 1 } as never)).toThrow(TypeError);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const removed = toggleItem({ array, item: 2 });
        const inserted = toggleItem({ array, item: 4 });

        expect(removed).toEqual([1, 3]);
        expect(removed).not.toBe(array);
        expect(inserted).toEqual([1, 2, 3, 4]);
        expect(inserted).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = toggleItem({
            array,
            item: undefined as unknown as number,
        });

        expect(result).toEqual([1, 3]);
        expect(1 in array).toBe(false);
    });
});
