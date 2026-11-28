import { describe, expect, it } from "vitest";
import { getRemainder } from "../index.js";

describe("getRemainder", () => {
    it("covers the documented behavior", () => {
        expect(getRemainder({ dividend: 5, divisor: 2 })).toBe(1);
        expect(getRemainder({ dividend: -5, divisor: 2 })).toBe(-1);
        expect(getRemainder({ dividend: 5, divisor: 0 })).toBeUndefined();
        expect(getRemainder({ dividend: 5, divisor: -0 })).toBeUndefined();
    });
});
