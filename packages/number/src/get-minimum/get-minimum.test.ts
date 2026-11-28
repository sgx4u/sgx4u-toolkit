import { describe, expect, it } from "vitest";
import { getMinimum } from "../index.js";

describe("getMinimum", () => {
    it("covers the documented behavior", () => {
        expect(getMinimum([3, 1, 2])).toBe(1);
        expect(getMinimum([])).toBeUndefined();
        expect(getMinimum([1, Number.NaN])).toBeUndefined();
        expect(Object.is(getMinimum([0, -0]), -0)).toBe(true);
    });
});
