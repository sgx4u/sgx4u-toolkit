import { describe, expect, it } from "vitest";
import { removeAtIndexes } from "./remove-at-indexes.js";

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

describe("removeAtIndexes", () => {
    it("removes the listed indexes", () => {
        expect(
            removeAtIndexes({ array: [1, 2, 3, 4], indexes: [0, 2] }),
        ).toEqual([2, 4]);
    });

    it("accepts negative indexes and ignores order", () => {
        expect(
            removeAtIndexes({ array: [1, 2, 3, 4], indexes: [-1, 0] }),
        ).toEqual([2, 3]);
    });

    it("removes a duplicate index once and skips invalid indexes", () => {
        expect(
            removeAtIndexes({
                array: [1, 2, 3, 4],
                indexes: [0, 0, 10, 1.5, -1],
            }),
        ).toEqual([2, 3]);
    });

    it("returns a shallow copy when no index is removed", () => {
        const array = [1, 2];
        const result = removeAtIndexes({ array, indexes: [] });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
        expect(removeAtIndexes({ array: [], indexes: [0] })).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(removeAtIndexes(null as never)).toBeUndefined();
        expect(removeAtIndexes("text" as never)).toBeUndefined();
        expect(removeAtIndexes(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and indexes is an array",
        (_label, array) => {
            expect(
                removeAtIndexes({ array: array as never, indexes: [0] }),
            ).toBeUndefined();
        },
    );

    it("throws when indexes is not an array", () => {
        expect(() => removeAtIndexes({} as never)).toThrow(TypeError);
        expect(() => removeAtIndexes(new Uint8Array() as never)).toThrow(
            TypeError,
        );
        expect(() => removeAtIndexes(new Set() as never)).toThrow(TypeError);
        expect(() => removeAtIndexes(generate() as never)).toThrow(TypeError);
        expect(() =>
            removeAtIndexes({ array: [1], indexes: "no" as never }),
        ).toThrow(TypeError);
        expect(() => removeAtIndexes({ indexes: 1 } as never)).toThrow(
            "`indexes` must be an array; received 1.",
        );
        expect(() => removeAtIndexes({ array: [1] } as never)).toThrow(
            TypeError,
        );
    });

    it("returns undefined when array is not an array and indexes is an array", () => {
        expect(
            removeAtIndexes({ array: "no", indexes: [0] } as never),
        ).toBeUndefined();
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = removeAtIndexes({ array, indexes: [1] });

        expect(result).toEqual([1, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = removeAtIndexes({ array, indexes: [0] });

        expect(result).toEqual([undefined, 3]);
        expect(0 in (result ?? [])).toBe(true);
        expect(1 in array).toBe(false);
    });
});
