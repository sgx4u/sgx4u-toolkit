import { describe, expect, it } from "vitest";
import { getModulo } from "../index.js";

describe("getModulo", () => {
    it("covers the documented behavior", () => {
        expect(getModulo({ dividend: -5, divisor: 2 })).toBe(1);
        expect(getModulo({ dividend: 5, divisor: 2 })).toBe(1);
        expect(getModulo({ dividend: 5, divisor: 0 })).toBeUndefined();
    });
});
