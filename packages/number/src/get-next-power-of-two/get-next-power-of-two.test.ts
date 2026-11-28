import { describe, expect, it } from "vitest";
import { getNextPowerOfTwo } from "../index.js";

describe("getNextPowerOfTwo", () => {
    it("covers the documented behavior", () => {
        expect(getNextPowerOfTwo(5)).toBe(8);
        expect(getNextPowerOfTwo(8)).toBe(8);
        expect(getNextPowerOfTwo(0.1)).toBe(0.125);
        expect(getNextPowerOfTwo(1)).toBe(1);
        expect(getNextPowerOfTwo(0)).toBeUndefined();
        expect(getNextPowerOfTwo(-2)).toBeUndefined();
        expect(getNextPowerOfTwo(Number.NaN)).toBeUndefined();
    });
});
