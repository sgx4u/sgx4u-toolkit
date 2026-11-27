import { describe, expect, it } from "vitest";
import { isPowerOfTwo } from "../index.js";

describe("isPowerOfTwo", () => {
    it("accepts powers of two", () => {
        expect(isPowerOfTwo(1)).toBe(true);
        expect(isPowerOfTwo(8)).toBe(true);
        expect(isPowerOfTwo(2 ** 40)).toBe(true);
    });

    it("rejects other values", () => {
        expect(isPowerOfTwo(0)).toBe(false);
        expect(isPowerOfTwo(0.5)).toBe(false);
        expect(isPowerOfTwo(3)).toBe(false);
        expect(isPowerOfTwo(-2)).toBe(false);
        expect(isPowerOfTwo(Number.POSITIVE_INFINITY)).toBe(false);
        expect(isPowerOfTwo("2")).toBe(false);
    });
});
