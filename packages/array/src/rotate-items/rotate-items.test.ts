import { describe, expect, it } from "vitest";
import { rotateItems } from "./rotate-items.js";

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

describe("rotateItems", () => {
    it("rotates a positive count toward the end", () => {
        expect(rotateItems({ array: [1, 2, 3], count: 1 })).toEqual([3, 1, 2]);
        expect(rotateItems({ array: [1, 2, 3, 4], count: 2 })).toEqual([
            3, 4, 1, 2,
        ]);
    });

    it("rotates a negative count toward the start", () => {
        expect(rotateItems({ array: [1, 2, 3], count: -1 })).toEqual([2, 3, 1]);
    });

    it("uses the count modulo the length", () => {
        expect(rotateItems({ array: [1, 2, 3], count: 4 })).toEqual([3, 1, 2]);
        expect(rotateItems({ array: [1, 2, 3], count: -4 })).toEqual([2, 3, 1]);
    });

    it("returns a shallow copy when the normalized distance is 0", () => {
        const array = [1, 2, 3];
        const result = rotateItems({ array, count: 3 });

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
        expect(rotateItems({ array, count: 0 })).toEqual([1, 2, 3]);
    });

    it("returns an empty array for any finite integer count", () => {
        expect(rotateItems({ array: [], count: 0 })).toEqual([]);
        expect(rotateItems({ array: [], count: 5 })).toEqual([]);
        expect(rotateItems({ array: [], count: -5 })).toEqual([]);
        const empty: number[] = [];
        expect(rotateItems({ array: empty, count: 1 })).not.toBe(empty);
    });

    it("restores the original items when rotated by the negated count", () => {
        const original = [1, 2, 3, 4, 5];
        const rotated = rotateItems({ array: original, count: 2 });
        const restored = rotateItems({ array: rotated ?? [], count: -2 });

        expect(restored).toEqual([...original]);
        expect(restored).not.toBe(original);
    });

    it("returns undefined for a non-object", () => {
        expect(rotateItems(null as never)).toBeUndefined();
        expect(rotateItems("text" as never)).toBeUndefined();
        expect(rotateItems(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and count is an integer",
        (_label, array) => {
            expect(
                rotateItems({ array: array as never, count: 1 }),
            ).toBeUndefined();
        },
    );

    it("throws when count is not a finite integer", () => {
        expect(() => rotateItems({} as never)).toThrow(TypeError);
        expect(() => rotateItems({ array: [1], count: 1.5 })).toThrow(
            RangeError,
        );
        expect(() => rotateItems({ array: [1], count: Number.NaN })).toThrow(
            RangeError,
        );
        expect(() => rotateItems({ array: [1], count: "1" as never })).toThrow(
            TypeError,
        );
        expect(() => rotateItems({ count: 1.5 } as never)).toThrow(RangeError);
        expect(() => rotateItems({ array: [1] } as never)).toThrow(TypeError);
        expect(() => rotateItems({ array: "no", count: 1.2 } as never)).toThrow(
            RangeError,
        );
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const item = { id: 1 };
        const array = Object.freeze([item, 2, 3]);
        const result = rotateItems({ array, count: 1 });

        expect(result).toEqual([3, item, 2]);
        expect(result).not.toBe(array);
        expect(result?.[1]).toBe(item);
        expect(array).toEqual([item, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = rotateItems({ array, count: 1 });

        expect(result).toEqual([3, 1, undefined]);
        expect(2 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
