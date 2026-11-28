import { describe, expect, it } from "vitest";
import { toBase } from "../index.js";

describe("toBase", () => {
    it("covers the documented behavior", () => {
        expect(toBase({ value: 255, base: 16, prefix: true })).toBe("0xff");
        expect(
            toBase({ value: 10n, base: 2, prefix: true, minimumDigits: 4 }),
        ).toBe("0b1010");
        expect(toBase({ value: -3, base: 10 })).toBe("-3");
        expect(toBase({ value: 1.5, base: 10 })).toBeUndefined();
        expect(
            toBase({ value: Number.MAX_SAFE_INTEGER + 2, base: 10 }),
        ).toBeUndefined();
        expect(() => toBase({ value: 1, base: 1 })).toThrow(RangeError);
    });
});
