import { describe, expect, it } from "vitest";
import { fillRange } from "./fill-range.js";

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

describe("fillRange", () => {
    it("fills the whole array when the range is omitted", () => {
        expect(fillRange({ array: [1, 2, 3], value: 0 })).toEqual([0, 0, 0]);
    });

    it("fills from start through end, matching Array#fill", () => {
        expect(
            fillRange({ array: [1, 2, 3, 4], value: 9, start: 1, end: 3 }),
        ).toEqual([1, 9, 9, 4]);
    });

    it("counts negative indexes from the end and clamps them", () => {
        expect(fillRange({ array: [1, 2, 3, 4], value: 9, start: -2 })).toEqual(
            [1, 2, 9, 9],
        );
        expect(
            fillRange({ array: [1, 2, 3, 4], value: 9, start: -10, end: -2 }),
        ).toEqual([9, 9, 3, 4]);
    });

    it("returns a shallow copy when the range is empty", () => {
        const array = [1, 2, 3, 4];
        const result = fillRange({ array, value: 9, start: 10 });

        expect(result).toEqual([1, 2, 3, 4]);
        expect(result).not.toBe(array);
        expect(fillRange({ array: [], value: 1 })).toEqual([]);
    });

    it("truncates a fractional bound the way Array#fill does", () => {
        expect(
            fillRange({ array: [1, 2, 3, 4], value: 0, start: 1.9, end: 3.2 }),
        ).toEqual([1, 0, 0, 4]);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(fillRange(value as never)).toBeUndefined();
    });

    it("throws when a present bound is not finite", () => {
        expect(() =>
            fillRange({ array: [1], value: 0, start: Number.NaN }),
        ).toThrow(RangeError);
        expect(() =>
            fillRange({ array: [1], value: 0, end: Number.POSITIVE_INFINITY }),
        ).toThrow(RangeError);
        expect(() => fillRange({ start: Number.NaN } as never)).toThrow(
            RangeError,
        );
        expect(() =>
            fillRange({ array: [1], value: 0, start: "1" as never }),
        ).toThrow(TypeError);
        expect(() => fillRange({ end: "2" } as never)).toThrow(TypeError);
    });

    it("does not throw when start and end are omitted", () => {
        expect(fillRange({ array: [1, 2], value: 0 })).toEqual([0, 0]);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = fillRange({ array, value: 0, start: 1 });

        expect(result).toEqual([1, 0, 0]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined outside the filled range", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = fillRange({ array, value: 9, start: 0, end: 1 });

        expect(result).toEqual([9, undefined, 3]);
        expect(1 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
