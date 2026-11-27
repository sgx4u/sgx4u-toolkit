import { describe, expect, it } from "vitest";
import { padArrayStart } from "./pad-array-start.js";

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

describe("padArrayStart", () => {
    it("pads the start until length", () => {
        expect(padArrayStart({ array: [1, 2], length: 4, value: 0 })).toEqual([
            0, 0, 1, 2,
        ]);
    });

    it("repeats the same value reference", () => {
        const value = { id: 0 };
        const result = padArrayStart({
            array: [] as Array<{ id: number }>,
            length: 2,
            value,
        });

        expect(result?.[0]).toBe(value);
        expect(result?.[1]).toBe(value);
    });

    it("returns a shallow copy when the array is already long enough", () => {
        const array = [1, 2, 3];
        const result = padArrayStart({ array, length: 2, value: 0 });

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
        expect(padArrayStart({ array, length: 3, value: 0 })).toEqual([
            1, 2, 3,
        ]);
    });

    it("pads an empty array", () => {
        expect(padArrayStart({ array: [], length: 2, value: 1 })).toEqual([
            1, 1,
        ]);
        const empty: number[] = [];
        const result = padArrayStart({ array: empty, length: 0, value: 1 });

        expect(result).toEqual([]);
        expect(result).not.toBe(empty);
    });

    it("returns undefined for a non-object", () => {
        expect(padArrayStart(null as never)).toBeUndefined();
        expect(padArrayStart("text" as never)).toBeUndefined();
        expect(padArrayStart(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and length is valid",
        (_label, array) => {
            expect(
                padArrayStart({ array: array as never, length: 2, value: 0 }),
            ).toBeUndefined();
        },
    );

    it("throws when length is not a non-negative integer", () => {
        expect(() => padArrayStart({} as never)).toThrow(TypeError);
        expect(() =>
            padArrayStart({ array: [1], length: -1, value: 0 }),
        ).toThrow(RangeError);
        expect(() =>
            padArrayStart({ array: [1], length: 1.5, value: 0 }),
        ).toThrow(RangeError);
        expect(() =>
            padArrayStart({ array: [1], length: "2" as never, value: 0 }),
        ).toThrow(TypeError);
        expect(() => padArrayStart({ length: -1 } as never)).toThrow(
            RangeError,
        );
        expect(() => padArrayStart({ array: [1], value: 0 } as never)).toThrow(
            TypeError,
        );
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2]);
        const result = padArrayStart({ array, length: 4, value: 0 });

        expect(result).toEqual([0, 0, 1, 2]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = padArrayStart({ array, length: 4, value: 0 });

        expect(result).toEqual([0, 1, undefined, 3]);
        expect(2 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
