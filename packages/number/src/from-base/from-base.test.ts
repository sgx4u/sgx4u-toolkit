import { describe, expect, it } from "vitest";
import { fromBase } from "../index.js";

describe("fromBase", () => {
    it("covers the documented behavior", () => {
        expect(fromBase({ value: "ff", base: 16 })).toBe(255);
        expect(fromBase({ value: "0xFF", base: 16 })).toBe(255);
        expect(fromBase({ value: "0b1010", base: 2 })).toBe(10);
        expect(fromBase({ value: "zz", base: 16 })).toBeUndefined();
        expect(() => fromBase({ value: "1", base: 40 })).toThrow(RangeError);
        const large = fromBase({ value: "1" + "0".repeat(20), base: 10 });
        expect(typeof large).toBe("bigint");
    });
});
