import { describe, expect, it } from "vitest";
import { zipWith } from "./zip-with.js";

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

describe("zipWith", () => {
    it("combines tuples", () => {
        expect(
            zipWith({
                arrays: [
                    [1, 2],
                    [3, 4],
                ],
                combine: (left, right) => Number(left) + Number(right),
            }),
        ).toEqual([4, 6]);
    });

    it("passes the fill value to combine in longest mode", () => {
        expect(
            zipWith({
                arrays: [[1, 2], [10]],
                combine: (left, right) => [left, right],
                fillValue: 0,
            }),
        ).toEqual([
            [1, 10],
            [2, 0],
        ]);
    });

    it("stops at the shortest array and does not call combine past it", () => {
        const seen: unknown[][] = [];
        const result = zipWith({
            arrays: [[1, 2, 3], [4]],
            mode: "shortest",
            combine: (...items) => {
                seen.push(items);
                return items.join(":");
            },
        });

        expect(result).toEqual(["1:4"]);
        expect(seen).toEqual([[1, 4]]);
    });

    it("returns an empty array for an empty list without calling combine", () => {
        expect(
            zipWith({
                arrays: [],
                combine: () => {
                    throw new Error("combine");
                },
            }),
        ).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(zipWith(null as never)).toBeUndefined();
        expect(zipWith("text" as never)).toBeUndefined();
        expect(zipWith(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when arrays is %s and combine is a function",
        (_label, arrays) => {
            expect(
                zipWith({
                    arrays: arrays as never,
                    combine: () => 0,
                }),
            ).toBeUndefined();
        },
    );

    it("throws when combine is not a function", () => {
        expect(() => zipWith({} as never)).toThrow(TypeError);
        expect(() =>
            zipWith({ arrays: [[1]], combine: "no" as never }),
        ).toThrow('`combine` must be a function; received "no".');
        expect(() => zipWith({ combine: 1 } as never)).toThrow(TypeError);
    });

    it("throws when strict lengths differ", () => {
        expect(() =>
            zipWith({
                arrays: [[1], [2, 3]],
                mode: "strict",
                combine: () => 0,
            }),
        ).toThrow(RangeError);
    });

    it("throws when mode is unknown before reading a bad list", () => {
        expect(() =>
            zipWith({ arrays: "no", mode: "wide", combine: () => 0 } as never),
        ).toThrow(RangeError);
    });

    it("does not mutate the inputs", () => {
        const array = Object.freeze([1, 2]);
        const result = zipWith({
            arrays: [array],
            combine: (item) => item,
        });

        expect(result).toEqual([1, 2]);
        expect(array).toEqual([1, 2]);
    });

    it("passes a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const sparse = [1, , 3] as number[];
        expect(
            zipWith({
                arrays: [sparse],
                combine: (item) => item,
            }),
        ).toEqual([1, undefined, 3]);
        expect(1 in sparse).toBe(false);
    });
});
