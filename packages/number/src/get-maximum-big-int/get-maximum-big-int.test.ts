import { describe, expect, it } from "vitest";
import { getMaximumBigInt } from "../index.js";

describe("getMaximumBigInt", () => {
    it("covers the documented behavior", () => {
        expect(getMaximumBigInt([3n, 1n])).toBe(3n);
        expect(getMaximumBigInt([])).toBeUndefined();
    });
});
