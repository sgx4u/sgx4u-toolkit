import { describe, expect, it } from "vitest";
import { zip } from "../zip/zip.js";
import { unzip } from "./unzip.js";

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

describe("unzip", () => {
    it("turns rows into columns", () => {
        expect(
            unzip([
                [1, 2],
                [3, 4],
            ]),
        ).toEqual([
            [1, 3],
            [2, 4],
        ]);
    });

    it("pads a short row with undefined", () => {
        expect(unzip([[1, 2], [3]])).toEqual([
            [1, 3],
            [2, undefined],
        ]);
    });

    it("treats a non-array slot as an empty row", () => {
        expect(unzip([[1, 2], null, [3, 4]])).toEqual([
            [1, undefined, 3],
            [2, undefined, 4],
        ]);
    });

    it("returns an empty array for an empty list", () => {
        const rows: unknown[] = [];
        const result = unzip(rows);

        expect(result).toEqual([]);
        expect(result).not.toBe(rows);
    });

    it.each(invalidInputs)("returns undefined for %s", (_label, value) => {
        expect(unzip(value as never)).toBeUndefined();
    });

    it("returns undefined for a function", () => {
        expect(unzip(generate as never)).toBeUndefined();
    });

    it("does not mutate a frozen matrix and returns new columns", () => {
        const row = Object.freeze([1, 2]);
        const matrix = Object.freeze([row, Object.freeze([3, 4])]);
        const result = unzip(matrix);

        expect(result).toEqual([
            [1, 3],
            [2, 4],
        ]);
        expect(result).not.toBe(matrix);
        expect(result?.[0]).not.toBe(row);
        expect(row).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const row = [1, , 3] as number[];
        expect(unzip([row])).toEqual([[1], [undefined], [3]]);
        expect(1 in row).toBe(false);
    });

    it("recovers each input truncated to the shortest length", () => {
        const samples = [
            [
                [1, 2, 3],
                [4, 5],
                [6, 7, 8, 9],
            ],
            [[1], [2, 3, 4]],
            [
                [1, 2],
                [3, 4],
            ],
            [
                ["a", "b", "c"],
                ["d", "e", "f"],
            ],
        ];
        for (const arrays of samples) {
            const shortest = Math.min(...arrays.map((array) => array.length));
            const zipped = zip({ arrays, mode: "shortest" });
            expect(unzip(zipped ?? [])).toEqual(
                arrays.map((array) => array.slice(0, shortest)),
            );
        }
    });
});
