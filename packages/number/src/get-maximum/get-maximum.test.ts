import { describe, expect, it } from "vitest";
import { getMaximum } from "../index.js";

describe("getMaximum", () => {
    it("covers the documented behavior", () => {
        expect(getMaximum([3, 1, 2])).toBe(3);
        expect(getMaximum([])).toBeUndefined();
        expect(getMaximum([Number.POSITIVE_INFINITY])).toBeUndefined();
    });
});
