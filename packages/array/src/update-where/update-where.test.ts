import { describe, expect, it } from "vitest";
import { updateWhere } from "./update-where.js";

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

describe("updateWhere", () => {
    it("updates the first match", () => {
        expect(
            updateWhere({
                array: [1, 2, 3, 4],
                predicate: (item) => item % 2 === 0,
                updater: (item) => item * 10,
            }),
        ).toEqual([1, 20, 3, 4]);
    });

    it("updates every match when all is true", () => {
        expect(
            updateWhere({
                array: [1, 2, 3, 4],
                predicate: (item) => item % 2 === 0,
                updater: (item, index) => item + index,
                all: true,
            }),
        ).toEqual([1, 3, 3, 7]);
    });

    it("returns a shallow copy when nothing matches", () => {
        const array = [1, 3, 5];
        const result = updateWhere({
            array,
            predicate: (item) => item % 2 === 0,
            updater: (item) => item * 10,
        });

        expect(result).toEqual([1, 3, 5]);
        expect(result).not.toBe(array);
        expect(
            updateWhere({
                array: [],
                predicate: () => true,
                updater: (item: number) => item,
            }),
        ).toEqual([]);
    });

    it("returns undefined for a non-object", () => {
        expect(updateWhere(null as never)).toBeUndefined();
        expect(updateWhere("text" as never)).toBeUndefined();
        expect(updateWhere(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s",
        (_label, array) => {
            expect(
                updateWhere({
                    array: array as never,
                    predicate: () => true,
                    updater: (item: number) => item,
                }),
            ).toBeUndefined();
        },
    );

    it("throws when predicate is not a function", () => {
        expect(() => updateWhere({} as never)).toThrow(TypeError);
        expect(() =>
            updateWhere({
                array: [1],
                predicate: "no" as never,
                updater: (item: number) => item,
            }),
        ).toThrow(TypeError);
        expect(() => updateWhere({ predicate: 1 } as never)).toThrow(TypeError);
    });

    it("throws when updater is present and is not a function", () => {
        expect(() =>
            updateWhere({
                array: [1],
                predicate: () => true,
                updater: 1 as never,
            }),
        ).toThrow("`updater` must be a function; received 1.");
        expect(() => updateWhere({ updater: "no" } as never)).toThrow(
            TypeError,
        );
    });

    it("throws when a real array omits predicate or updater", () => {
        expect(() =>
            updateWhere({
                array: [1],
                updater: (item: number) => item,
            } as never),
        ).toThrow(TypeError);
        expect(() =>
            updateWhere({ array: [1], predicate: () => true } as never),
        ).toThrow(TypeError);
    });

    it("does not mutate a frozen array and returns a new reference", () => {
        const array = Object.freeze([1, 2, 3]);
        const result = updateWhere({
            array,
            predicate: (item) => item === 2,
            updater: () => 9,
        });

        expect(result).toEqual([1, 9, 3]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3]);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [1, , 3] as number[];
        const result = updateWhere({
            array,
            predicate: (item) => item === undefined,
            updater: () => 0,
        });

        expect(result).toEqual([1, 0, 3]);
        expect(1 in array).toBe(false);
    });
});
