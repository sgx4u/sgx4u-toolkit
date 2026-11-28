import { describe, expect, it } from "vitest";
import { isNumericString } from "./is-numeric-string.js";

describe("isNumericString", () => {
    it("accepts digits and the optional sign or decimal", () => {
        expect(isNumericString("42")).toBe(true);
        expect(isNumericString("")).toBe(false);
        expect(isNumericString("-1")).toBe(false);
        expect(isNumericString({ value: "-1", allowSign: true })).toBe(true);
        expect(isNumericString({ value: "1.5", allowDecimal: true })).toBe(
            true,
        );
        expect(isNumericString({ value: "1.", allowDecimal: true })).toBe(
            false,
        );
        expect(isNumericString({ value: "1.2.3", allowDecimal: true })).toBe(
            false,
        );
        expect(isNumericString(null)).toBe(false);
    });
});
