import { describe, expect, it } from "vitest";
import { unzipWith } from "./unzip-with.js";

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

describe("unzipWith", () => {
    it("combines each column", () => {
        expect(
            unzipWith({
                array: [
                    [1, 2],
                    [3, 4],
                ],
                combine: (left, right) => Number(left) + Number(right),
            }),
        ).toEqual([4, 6]);
    });

    it("passes undefined for a missing cell", () => {
        expect(
            unzipWith({
                array: [[1, 2], [3]],
                combine: (...column) => column,
            }),
        ).toEqual([
            [1, 3],
            [2, undefined],
        ]);
    });

    it("treats a non-array row as empty", () => {
        expect(
            unzipWith({
                array: [[1], "no", [3]],
                combine: (...column) => column,
            }),
        ).toEqual([[1, undefined, 3]]);
    });

    it("returns an empty array when there are no columns", () => {
        expect(
            unzipWith({
                array: [],
                combine: () => {
                    throw new Error("combine");
                },
            }),
        ).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(unzipWith(null as never)).toBeUndefined();
        expect(unzipWith("text" as never)).toBeUndefined();
        expect(unzipWith(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s and combine is a function",
        (_label, array) => {
            expect(
                unzipWith({ array: array as never, combine: () => 0 }),
            ).toBeUndefined();
        },
    );

    it("throws when combine is not a function", () => {
        expect(() => unzipWith({} as never)).toThrow(TypeError);
        expect(() =>
            unzipWith({ array: [[1]], combine: "no" as never }),
        ).toThrow('`combine` must be a function; received "no".');
        expect(() => unzipWith({ combine: 1 } as never)).toThrow(TypeError);
    });

    it("does not mutate a frozen matrix", () => {
        const row = Object.freeze([1, 2]);
        const matrix = Object.freeze([row]);
        const result = unzipWith({
            array: matrix,
            combine: (item) => item,
        });

        expect(result).toEqual([1, 2]);
        expect(row).toEqual([1, 2]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const row = [1, , 3] as number[];
        expect(
            unzipWith({
                array: [row],
                combine: (item) => item,
            }),
        ).toEqual([1, undefined, 3]);
        expect(1 in row).toBe(false);
    });
});
