import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { chunk } from "../chunk/chunk.js";
import { flatten } from "./flatten.js";

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

describe("flatten", () => {
    it("flattens one level for a bare array", () => {
        expect(flatten([1, [2, [3]], 4])).toEqual([1, 2, [3], 4]);
    });

    it("flattens the requested depth", () => {
        expect(flatten({ array: [1, [2, [3]]], depth: 2 })).toEqual([1, 2, 3]);
    });

    it("returns a shallow copy when depth is 0", () => {
        const nested = [2];
        const array = [1, nested];
        const result = flatten({ array, depth: 0 });

        expect(result).toEqual([1, nested]);
        expect(result).not.toBe(array);
        expect(result?.[1]).toBe(nested);
    });

    it("returns an empty array for an empty array", () => {
        const array: unknown[] = [];
        const result = flatten(array);

        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("does not flatten strings, sets, or typed arrays", () => {
        const values = new Set([1]);
        const typed = new Uint8Array([4, 5]);
        expect(flatten(["ab", [values], typed])).toEqual(["ab", values, typed]);
    });

    it("returns undefined for a non-object", () => {
        expect(flatten(null as never)).toBeUndefined();
        expect(flatten("text" as never)).toBeUndefined();
        expect(flatten(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s",
        (_label, array) => {
            expect(flatten({ array: array as never })).toBeUndefined();
        },
    );

    it("throws when depth is not a non-negative integer", () => {
        expect(() => flatten({ array: [1], depth: -1 })).toThrow(RangeError);
        expect(() => flatten({ array: [1], depth: 1.5 })).toThrow(RangeError);
        expect(() => flatten({ array: [1], depth: "1" as never })).toThrow(
            TypeError,
        );
        expect(() => flatten({ depth: -1 } as never)).toThrow(RangeError);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const nested = Object.freeze([2]);
        const array = Object.freeze([1, nested]);
        const result = flatten(array);

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, nested]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , [3]] as unknown[];
        expect(flatten(array)).toEqual([1, undefined, 3]);
        expect(1 in array).toBe(false);
    });

    it("flattens chunks back into the original values", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer()),
                fc.integer({ min: 1, max: 8 }),
                (values, size) => {
                    const chunks = chunk({ array: values, size });
                    expect(flatten({ array: chunks ?? [], depth: 1 })).toEqual([
                        ...values,
                    ]);
                },
            ),
        );
    });
});
