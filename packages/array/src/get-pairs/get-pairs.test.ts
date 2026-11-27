import { describe, expect, it } from "vitest";
import { getPairs } from "./get-pairs.js";

describe("getPairs", () => {
    it("returns the pairs of three items", () => {
        const values = Object.freeze([1, 2, 3]);
        const pairs = getPairs(values);
        expect(pairs).toEqual([
            [1, 2],
            [1, 3],
            [2, 3],
        ]);
        expect(pairs?.[0]).not.toBe(values);
        expect(values).toEqual([1, 2, 3]);
    });

    it("returns an empty array when fewer than two items are present", () => {
        expect(getPairs([])).toEqual([]);
        expect(getPairs([1])).toEqual([]);
    });

    it("returns undefined when the input is not an array", () => {
        expect(getPairs(null as never)).toBeUndefined();
    });
});
