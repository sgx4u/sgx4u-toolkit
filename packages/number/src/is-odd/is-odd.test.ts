import { describe, expect, it } from "vitest";
import { isOdd } from "../index.js";

describe("isOdd", () => {
    it("accepts odd integers", () => {
        expect(isOdd(3)).toBe(true);
        expect(isOdd(-1)).toBe(true);
    });

    it("rejects evens and non-integers", () => {
        expect(isOdd(2)).toBe(false);
        expect(isOdd(0)).toBe(false);
        expect(isOdd(1.5)).toBe(false);
        expect(isOdd(Number.POSITIVE_INFINITY)).toBe(false);
    });
});
