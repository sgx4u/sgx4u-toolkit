import { describe, expect, it } from "vitest";
import { cycleItems } from "./cycle-items.js";

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

describe("cycleItems", () => {
    it("wraps to the start", () => {
        expect(cycleItems({ array: [1, 2, 3], count: 5 })).toEqual([
            1, 2, 3, 1, 2,
        ]);
    });

    it("returns a prefix when count is shorter than the array", () => {
        const array = [1, 2, 3];
        const result = cycleItems({ array, count: 2 });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
    });

    it("returns an empty array for count 0 or an empty source", () => {
        expect(cycleItems({ array: [1, 2], count: 0 })).toEqual([]);
        const empty: number[] = [];
        const result = cycleItems({ array: empty, count: 5 });

        expect(result).toEqual([]);
        expect(result).not.toBe(empty);
        expect(cycleItems({ array: [], count: 0 })).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(cycleItems(null as never)).toBeUndefined();
        expect(cycleItems("text" as never)).toBeUndefined();
        expect(cycleItems(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and count is valid",
        (_label, array) => {
            expect(
                cycleItems({ array: array as never, count: 3 }),
            ).toBeUndefined();
        },
    );

    it("throws when count is not a non-negative integer", () => {
        expect(() => cycleItems({} as never)).toThrow(TypeError);
        expect(() => cycleItems({ array: [1], count: -1 })).toThrow(RangeError);
        expect(() => cycleItems({ array: [1], count: 1.5 })).toThrow(
            RangeError,
        );
        expect(() => cycleItems({ count: "2" } as never)).toThrow(TypeError);
        expect(() => cycleItems({ array: "no", count: -1 } as never)).toThrow(
            RangeError,
        );
    });

    it("does not mutate a frozen array and keeps item references", () => {
        const item = { id: 1 };
        const array = Object.freeze([item, 2]);
        const result = cycleItems({ array, count: 3 });

        expect(result).toEqual([item, 2, item]);
        expect(result).not.toBe(array);
        expect(result?.[0]).toBe(item);
        expect(result?.[2]).toBe(item);
        expect(array).toEqual([item, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        expect(cycleItems({ array, count: 4 })).toEqual([1, undefined, 3, 1]);
        expect(1 in array).toBe(false);
    });
});
