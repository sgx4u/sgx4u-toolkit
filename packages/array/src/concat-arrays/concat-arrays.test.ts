import { describe, expect, it } from "vitest";
import { concatArrays } from "./concat-arrays.js";

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

describe("concatArrays", () => {
    it("concatenates arrays in order", () => {
        expect(concatArrays({ arrays: [[1], [2, 3], [4]] })).toEqual([
            1, 2, 3, 4,
        ]);
    });

    it("ignores empty arrays when skipEmpty is true", () => {
        expect(
            concatArrays({ arrays: [[1], [], [2]], skipEmpty: true }),
        ).toEqual([1, 2]);
    });

    it("keeps the same items when skipEmpty is omitted", () => {
        expect(concatArrays({ arrays: [[1], [], [2]] })).toEqual([1, 2]);
    });

    it("returns an empty array for an empty list", () => {
        expect(concatArrays({ arrays: [] })).toEqual([]);
        expect(concatArrays({ arrays: [[]], skipEmpty: true })).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(concatArrays(null as never)).toBeUndefined();
        expect(concatArrays("text" as never)).toBeUndefined();
        expect(concatArrays(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when arrays is %s",
        (_label, arrays) => {
            expect(concatArrays({ arrays: arrays as never })).toBeUndefined();
        },
    );

    it("returns undefined when a slot is not an array", () => {
        expect(concatArrays({ arrays: [[1], "no" as never] })).toBeUndefined();
        expect(concatArrays({} as never)).toBeUndefined();
    });

    it("does not mutate the inputs and returns a new array", () => {
        const first = Object.freeze([1]);
        const item = { id: 1 };
        const result = concatArrays({ arrays: [[item], first] });

        expect(result).toEqual([item, 1]);
        expect(result).not.toBe(first);
        expect(result?.[0]).toBe(item);
        expect(first).toEqual([1]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const sparse = [1, , 3] as number[];
        expect(concatArrays({ arrays: [sparse] })).toEqual([1, undefined, 3]);
        expect(1 in sparse).toBe(false);
    });
});
