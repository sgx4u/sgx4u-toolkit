import { describe, expect, it } from "vitest";
import { getMean } from "./get-mean.js";

describe("getMean", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getMean({ array: [] })).toBeUndefined();
        expect(getMean(null as never)).toBeUndefined();
    });

    it("returns the arithmetic mean", () => {
        const values = Object.freeze([1, 2, 3, 4]);
        expect(getMean({ array: values })).toBe(2.5);
        expect(getMean({ array: [{ n: 2 }, { n: 4 }], by: "n" })).toBe(3);
        expect(values).toEqual([1, 2, 3, 4]);
    });

    it("throws when an item is not a finite number", () => {
        expect(() => getMean({ array: [1, Number.NaN] })).toThrow(TypeError);
    });
});
