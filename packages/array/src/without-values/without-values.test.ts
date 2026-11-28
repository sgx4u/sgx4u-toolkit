import { describe, expect, it } from "vitest";
import type { WithoutValuesParams } from "./without-values.types.js";
import { withoutValues } from "./without-values.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 2;
    return array;
}

describe("withoutValues", () => {
    it("removes matching values and keeps the other duplicates", () => {
        const params: WithoutValuesParams<number> = {
            array: [1, 2, 2, 3, 1],
            values: [2, 9],
        };
        const result = withoutValues(params);
        expect(result).toEqual([1, 3, 1]);
        expect(result).not.toBe(params.array);
    });

    it("returns a copy when values is empty", () => {
        const array = [1, 1, 2];
        const result = withoutValues({ array, values: [] });
        expect(result).toEqual([1, 1, 2]);
        expect(result).not.toBe(array);
    });

    it("treats NaN as equal to NaN and -0 as equal to 0", () => {
        expect(
            withoutValues({
                array: [Number.NaN, 0, 1, -0],
                values: [Number.NaN, -0],
            }),
        ).toEqual([1]);
    });

    it("uses a custom equals function", () => {
        expect(
            withoutValues({
                array: ["a", "B", "c"],
                values: ["b"],
                equals: (left, right) =>
                    left.toLowerCase() === right.toLowerCase(),
            }),
        ).toEqual(["a", "c"]);
    });

    it("returns undefined when array or values is not an array", () => {
        expect(withoutValues(null)).toBeUndefined();
        expect(withoutValues({})).toBeUndefined();
        expect(withoutValues("text")).toBeUndefined();
        expect(withoutValues(new Uint8Array([1]))).toBeUndefined();
        expect(withoutValues(new Set([1]))).toBeUndefined();
        expect(withoutValues(generate())).toBeUndefined();
        expect(
            withoutValues({ array: [1], values: "no" as never }),
        ).toBeUndefined();
        expect(
            withoutValues({ array: "text" as never, values: [1] }),
        ).toBeUndefined();
    });

    it("does not mutate a frozen input", () => {
        const array = Object.freeze([1, 2, 2]);
        const values = Object.freeze([2]);
        expect(withoutValues({ array, values })).toEqual([1]);
        expect(array).toEqual([1, 2, 2]);
    });

    it("copies holes as undefined", () => {
        expect(withoutValues({ array: sparse(), values: [1] })).toEqual([
            undefined,
            2,
        ]);
    });

    it("throws when equals is not a function", () => {
        expect(() =>
            withoutValues({ array: [1], values: [1], equals: "nope" as never }),
        ).toThrow(TypeError);
        expect(() =>
            withoutValues({
                array: "text" as never,
                values: "no" as never,
                equals: 1 as never,
            }),
        ).toThrow(TypeError);
    });
});
