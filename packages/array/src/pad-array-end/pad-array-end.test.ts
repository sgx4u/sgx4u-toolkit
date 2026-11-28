import { describe, expect, it } from "vitest";
import { padArrayEnd } from "./pad-array-end.js";

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

describe("padArrayEnd", () => {
    it("pads the end until length", () => {
        expect(padArrayEnd({ array: [1, 2], length: 4, value: 0 })).toEqual([
            1, 2, 0, 0,
        ]);
    });

    it("repeats the same value reference", () => {
        const value = { id: 0 };
        const result = padArrayEnd({
            array: [] as Array<{ id: number }>,
            length: 2,
            value,
        });

        expect(result?.[0]).toBe(value);
        expect(result?.[1]).toBe(value);
    });

    it("returns a shallow copy when the array is already long enough", () => {
        const array = [1, 2, 3];
        const result = padArrayEnd({ array, length: 2, value: 0 });

        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(array);
        expect(padArrayEnd({ array, length: 3, value: 0 })).toEqual([1, 2, 3]);
    });

    it("pads an empty array", () => {
        expect(padArrayEnd({ array: [], length: 2, value: 1 })).toEqual([1, 1]);
        const empty: number[] = [];
        const result = padArrayEnd({ array: empty, length: 0, value: 1 });

        expect(result).toEqual([]);
        expect(result).not.toBe(empty);
    });

    it("returns undefined for a non-object", () => {
        expect(padArrayEnd(null as never)).toBeUndefined();
        expect(padArrayEnd("text" as never)).toBeUndefined();
        expect(padArrayEnd(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and length is valid",
        (_label, array) => {
            expect(
                padArrayEnd({ array: array as never, length: 2, value: 0 }),
            ).toBeUndefined();
        },
    );

    it("throws when length is not a non-negative integer", () => {
        expect(() => padArrayEnd({} as never)).toThrow(TypeError);
        expect(() => padArrayEnd({ array: [1], length: -1, value: 0 })).toThrow(
            RangeError,
        );
        expect(() =>
            padArrayEnd({ array: [1], length: 1.5, value: 0 }),
        ).toThrow(RangeError);
        expect(() =>
            padArrayEnd({ array: [1], length: "2" as never, value: 0 }),
        ).toThrow(TypeError);
        expect(() => padArrayEnd({ length: -1 } as never)).toThrow(RangeError);
        expect(() => padArrayEnd({ array: [1], value: 0 } as never)).toThrow(
            TypeError,
        );
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2]);
        const result = padArrayEnd({ array, length: 4, value: 0 });

        expect(result).toEqual([1, 2, 0, 0]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = padArrayEnd({ array, length: 4, value: 0 });

        expect(result).toEqual([1, undefined, 3, 0]);
        expect(1 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
