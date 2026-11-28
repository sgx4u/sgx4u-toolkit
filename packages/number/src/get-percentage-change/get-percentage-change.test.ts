import { describe, expect, it } from "vitest";
import { getPercentageChange } from "../index.js";

describe("getPercentageChange", () => {
    it("covers the documented behavior", () => {
        expect(getPercentageChange({ from: 50, to: 75 })).toBe(50);
        expect(getPercentageChange({ from: 0, to: 1 })).toBeUndefined();
    });
});
