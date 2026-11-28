import { describe, expect, it } from "vitest";
import { getPowerSet } from "./get-power-set.js";

describe("getPowerSet", () => {
    it("returns subsets by increasing size", () => {
        const values = Object.freeze([1, 2]);
        const subsets = getPowerSet(values);
        expect(subsets).toEqual([[], [1], [2], [1, 2]]);
        expect(subsets?.[3]).not.toBe(values);
        expect(values).toEqual([1, 2]);
    });

    it("returns one empty subset for an empty array", () => {
        expect(getPowerSet([])).toEqual([[]]);
    });

    it("returns undefined when the input is not an array", () => {
        expect(getPowerSet("no" as never)).toBeUndefined();
        expect(getPowerSet(undefined as never)).toBeUndefined();
    });
});
