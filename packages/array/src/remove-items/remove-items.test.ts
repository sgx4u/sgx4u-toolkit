import { describe, expect, it } from "vitest";
import { removeItems } from "./remove-items.js";

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

describe("removeItems", () => {
    it("removes values", () => {
        expect(removeItems({ array: [1, 2, 3, 2], values: [2] })).toEqual([
            1, 3,
        ]);
    });

    it("removes items that match a predicate", () => {
        expect(
            removeItems({
                array: [1, 2, 3, 4],
                predicate: (item) => item % 2 === 0,
            }),
        ).toEqual([1, 3]);
    });

    it("removes an item when either the predicate or a value matches", () => {
        expect(
            removeItems({
                array: [1, 2, 3, 4],
                predicate: (item) => item === 1,
                values: [4],
            }),
        ).toEqual([2, 3]);
    });

    it("treats NaN as equal to NaN", () => {
        expect(
            removeItems({ array: [Number.NaN, 1], values: [Number.NaN] }),
        ).toEqual([1]);
    });

    it("uses a custom equals function", () => {
        expect(
            removeItems({
                array: ["a", "B", "c"],
                values: ["b"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["a", "c"]);
    });

    it("returns a shallow copy when nothing matches", () => {
        const array = [1, 2];
        const result = removeItems({ array, values: [9] });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
        expect(removeItems({ array: [], values: [1] })).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(removeItems(null as never)).toBeUndefined();
        expect(removeItems("text" as never)).toBeUndefined();
        expect(removeItems(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and a matcher is set",
        (_label, array) => {
            expect(
                removeItems({
                    array: array as never,
                    predicate: () => false,
                }),
            ).toBeUndefined();
        },
    );

    it("throws when neither predicate nor values is provided", () => {
        expect(() => removeItems({} as never)).toThrow(
            "`removeItems` requires `predicate` or `values`.",
        );
        expect(() => removeItems({ array: [1] })).toThrow(
            "`removeItems` requires `predicate` or `values`.",
        );
        expect(() => removeItems({ array: "no" } as never)).toThrow(
            "`removeItems` requires `predicate` or `values`.",
        );
    });

    it("throws when predicate is present and is not a function", () => {
        expect(() =>
            removeItems({ array: [1], predicate: "no" as never }),
        ).toThrow(TypeError);
        expect(() => removeItems({ predicate: 1 } as never)).toThrow(TypeError);
    });

    it("throws when values is present and is not an array", () => {
        expect(() =>
            removeItems({ array: [1], values: "no" as never }),
        ).toThrow('`values` must be an array; received "no".');
    });

    it("throws when equals is present and is not a function", () => {
        expect(() =>
            removeItems({
                array: [1],
                values: [1],
                equals: "no" as never,
            }),
        ).toThrow(TypeError);
        expect(() =>
            removeItems({ values: [1], equals: true } as never),
        ).toThrow(TypeError);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = removeItems({ array, values: [2] });

        expect(result).toEqual([1, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = removeItems({
            array,
            predicate: (item) => item === undefined,
        });

        expect(result).toEqual([1, 3]);
        expect(1 in array).toBe(false);
    });
});
