import { describe, expect, it } from "vitest";
import { transpose } from "./transpose.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

const invalidInputs: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    ["a generator", generate()],
];

describe("transpose", () => {
    it("turns rows into columns", () => {
        expect(
            transpose([
                [1, 2, 3],
                [4, 5, 6],
            ]),
        ).toEqual([
            [1, 4],
            [2, 5],
            [3, 6],
        ]);
    });

    it("pads a short row with undefined", () => {
        expect(transpose([[1, 2], [3]])).toEqual([
            [1, 3],
            [2, undefined],
        ]);
    });

    it("treats a non-array row as empty", () => {
        expect(transpose([[1, 2], "no", [3]])).toEqual([
            [1, undefined, 3],
            [2, undefined, undefined],
        ]);
    });

    it("returns an empty array for an empty matrix", () => {
        const matrix: unknown[] = [];
        const result = transpose(matrix);

        expect(result).toEqual([]);
        expect(result).not.toBe(matrix);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(transpose(value as never)).toBeUndefined();
    });

    it("does not mutate a frozen matrix and returns new columns", () => {
        const row = Object.freeze([1, 2]);
        const matrix = Object.freeze([row]);
        const result = transpose(matrix);

        expect(result).toEqual([[1], [2]]);
        expect(result).not.toBe(matrix);
        expect(result?.[0]).not.toBe(row);
        expect(row).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const row = [1, , 3] as number[];
        expect(transpose([row])).toEqual([[1], [undefined], [3]]);
        expect(1 in row).toBe(false);
    });
});
