import { describe, expect, it } from "vitest";
import { getSum } from "./get-sum.js";

describe("getSum", () => {
    it("returns 0 for an empty array and undefined for a non-array", () => {
        expect(getSum({ array: [] })).toBe(0);
        expect(getSum({ array: "no" } as never)).toBeUndefined();
        expect(getSum(undefined as never)).toBeUndefined();
    });

    it("adds finite numbers and can read them with by", () => {
        const values = Object.freeze([1, 2, 3]);
        expect(getSum({ array: values })).toBe(6);
        expect(values).toEqual([1, 2, 3]);
        expect(
            getSum({
                array: [{ n: 1 }, { n: 2 }],
                by: "n",
            }),
        ).toBe(3);
    });

    it("throws when an item is not a finite number", () => {
        expect(() => getSum({ array: [1, "2"] })).toThrow(TypeError);
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        expect(() => getSum({ array: values })).toThrow(TypeError);
    });
});
