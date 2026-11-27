import { describe, expect, it } from "vitest";
import { zip } from "./zip.js";

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

describe("zip", () => {
    it("fills to the longest array", () => {
        expect(zip({ arrays: [[1, 2], [3]] })).toEqual([
            [1, 3],
            [2, undefined],
        ]);
        expect(zip({ arrays: [[1, 2], [3]], fillValue: 0 })).toEqual([
            [1, 3],
            [2, 0],
        ]);
    });

    it("stops at the shortest array", () => {
        expect(
            zip({
                arrays: [
                    [1, 2, 3],
                    [4, 5],
                ],
                mode: "shortest",
            }),
        ).toEqual([
            [1, 4],
            [2, 5],
        ]);
    });

    it("returns an empty array for an empty list or empty rows", () => {
        expect(zip({ arrays: [] })).toEqual([]);
        expect(zip({ arrays: [[], []] })).toEqual([]);
    });

    it("returns one-item tuples for a single array", () => {
        expect(zip({ arrays: [[1, 2]], mode: "strict" })).toEqual([[1], [2]]);
    });

    it("returns undefined for a non-object", () => {
        expect(zip(null as never)).toBeUndefined();
        expect(zip("text" as never)).toBeUndefined();
        expect(zip(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when arrays is %s",
        (_label, arrays) => {
            expect(zip({ arrays: arrays as never })).toBeUndefined();
        },
    );

    it("returns undefined when a slot is not an array", () => {
        expect(zip({ arrays: [[1], "no" as never] })).toBeUndefined();
        expect(zip({} as never)).toBeUndefined();
    });

    it("throws when mode is unknown", () => {
        expect(() => zip({ arrays: [[1]], mode: "wide" as never })).toThrow(
            RangeError,
        );
        expect(() => zip({ mode: "wide" } as never)).toThrow(
            '`mode` must be "longest", "shortest", or "strict"; received "wide".',
        );
    });

    it("throws when strict lengths differ", () => {
        expect(() => zip({ arrays: [[1], [2, 3]], mode: "strict" })).toThrow(
            '`arrays` must have the same length when `mode` is "strict"; received 1,2.',
        );
    });

    it("does not mutate the inputs and returns new rows", () => {
        const first = Object.freeze([1, 2]);
        const second = Object.freeze([3]);
        const arrays = Object.freeze([first, second]);
        const result = zip({ arrays });

        expect(result).toEqual([
            [1, 3],
            [2, undefined],
        ]);
        expect(result).not.toBe(arrays);
        expect(result?.[0]).not.toBe(first);
        expect(first).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const sparse = [1, , 3] as number[];
        const result = zip({ arrays: [sparse, [4, 5, 6]], mode: "strict" });

        expect(result).toEqual([
            [1, 4],
            [undefined, 5],
            [3, 6],
        ]);
        expect(1 in sparse).toBe(false);
    });
});
