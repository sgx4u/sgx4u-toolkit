import { describe, expect, it } from "vitest";
import { interleave } from "./interleave.js";

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

describe("interleave", () => {
    it("reads arrays in round-robin order", () => {
        expect(interleave({ arrays: [[1, 2, 3], [4], [5, 6]] })).toEqual([
            1, 4, 5, 2, 6, 3,
        ]);
    });

    it("skips an exhausted array", () => {
        expect(interleave({ arrays: [[], [1, 2], [3]] })).toEqual([1, 3, 2]);
    });

    it("returns an empty array for an empty list", () => {
        expect(interleave({ arrays: [] })).toEqual([]);
        expect(interleave({ arrays: [[], []] })).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(interleave(null as never)).toBeUndefined();
        expect(interleave("text" as never)).toBeUndefined();
        expect(interleave(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when arrays is %s",
        (_label, arrays) => {
            expect(interleave({ arrays: arrays as never })).toBeUndefined();
        },
    );

    it("returns undefined when a slot is not an array", () => {
        expect(interleave({ arrays: [[1], "no" as never] })).toBeUndefined();
        expect(interleave({} as never)).toBeUndefined();
    });

    it("does not mutate the inputs and returns a new array", () => {
        const first = Object.freeze([1, 2]);
        const arrays = Object.freeze([first]);
        const result = interleave({ arrays });

        expect(result).toEqual([1, 2]);
        expect(result).not.toBe(first);
        expect(first).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const sparse = [1, , 3] as number[];
        expect(interleave({ arrays: [sparse] })).toEqual([1, undefined, 3]);
        expect(1 in sparse).toBe(false);
    });
});
