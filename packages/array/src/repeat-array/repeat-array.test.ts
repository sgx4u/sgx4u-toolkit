import { describe, expect, it } from "vitest";
import { repeatArray } from "./repeat-array.js";

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

describe("repeatArray", () => {
    it("concatenates shallow copies", () => {
        const item = { id: 1 };
        const result = repeatArray({ array: [item, 2], count: 3 });

        expect(result).toEqual([item, 2, item, 2, item, 2]);
        expect(result?.[0]).toBe(item);
        expect(result?.[2]).toBe(item);
    });

    it("returns an empty array when count is 0 or the array is empty", () => {
        const array = [1, 2];
        const emptyCount = repeatArray({ array, count: 0 });
        expect(emptyCount).toEqual([]);
        expect(emptyCount).not.toBe(array);
        expect(repeatArray({ array: [], count: 4 })).toEqual([]);
    });

    it("returns a shallow copy when count is 1", () => {
        const array = [1, 2];
        const result = repeatArray({ array, count: 1 });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object", () => {
        expect(repeatArray(null as never)).toBeUndefined();
        expect(repeatArray("text" as never)).toBeUndefined();
        expect(repeatArray(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and count is valid",
        (_label, array) => {
            expect(
                repeatArray({ array: array as never, count: 2 }),
            ).toBeUndefined();
        },
    );

    it("throws when count is not a non-negative integer", () => {
        expect(() => repeatArray({} as never)).toThrow(TypeError);
        expect(() => repeatArray({ array: [1], count: -1 })).toThrow(
            RangeError,
        );
        expect(() => repeatArray({ array: [1], count: 1.5 })).toThrow(
            RangeError,
        );
        expect(() => repeatArray({ count: "1" } as never)).toThrow(TypeError);
        expect(() => repeatArray({ array: "no", count: -1 } as never)).toThrow(
            RangeError,
        );
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 2]);
        const result = repeatArray({ array, count: 2 });

        expect(result).toEqual([1, 2, 1, 2]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        expect(repeatArray({ array, count: 2 })).toEqual([
            1,
            undefined,
            3,
            1,
            undefined,
            3,
        ]);
        expect(1 in array).toBe(false);
    });
});
