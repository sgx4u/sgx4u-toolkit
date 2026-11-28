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
        expect(toSignificantDigits({ value: 1e-320, digits: 1 })).toBeCloseTo(
            1e-320,
        );
        expect(toSignificantDigits({ value: 12345, digits: 20 })).toBe(12345);
        expect(
            toSignificantDigits({ value: -12345, digits: 2, mode: "ceil" }),
        ).toBe(-12000);
        expect(
            toSignificantDigits({ value: -12345, digits: 2, mode: "floor" }),
        ).toBe(-13000);
        expect(
            toSignificantDigits({ value: 12345, digits: 2, mode: "ceil" }),
        ).toBe(13000);
        expect(
            toSignificantDigits({ value: -1.25, digits: 2, mode: "halfCeil" }),
        ).toBe(-1.2);
        expect(
            toSignificantDigits({ value: -1.25, digits: 2, mode: "halfFloor" }),
        ).toBe(-1.3);
        expect(
            toSignificantDigits({
                value: -1.25,
                digits: 2,
                mode: "halfExpand",
            }),
        ).toBe(-1.3);
    });
});
