import { describe, expect, it } from "vitest";
import { getMinimumBigInt } from "../index.js";

describe("getMinimumBigInt", () => {
    it("covers the documented behavior", () => {
        expect(getMinimumBigInt([3n, 1n, 2n])).toBe(1n);
        expect(getMinimumBigInt([])).toBeUndefined();
    });
});
