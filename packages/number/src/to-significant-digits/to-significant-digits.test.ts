import { describe, expect, it } from "vitest";
import { toSignificantDigits } from "../index.js";

describe("toSignificantDigits", () => {
    it("covers the documented behavior", () => {
        expect(toSignificantDigits({ value: 12345, digits: 2 })).toBe(12000);
        expect(toSignificantDigits({ value: 0.012345, digits: 3 })).toBe(
            0.0123,
        );
        expect(
            toSignificantDigits({ value: Number.NaN, digits: 2 }),
        ).toBeUndefined();
        expect(() => toSignificantDigits({ value: 1, digits: 0 })).toThrow(
            RangeError,
        );
    });
});
