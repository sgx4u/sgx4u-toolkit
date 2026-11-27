import { describe, expect, it } from "vitest";
import { parsePercent } from "../index.js";

describe("parsePercent", () => {
    it("covers the documented behavior", () => {
        expect(parsePercent({ value: "25%" })).toBe(0.25);
        expect(parsePercent({ value: "25 %" })).toBe(0.25);
        expect(parsePercent({ value: "25" })).toBe(0.25);
        expect(parsePercent({ value: 25 })).toBe(0.25);
        expect(parsePercent({ value: "12,5 %", locale: "de-DE" })).toBe(0.125);
        expect(parsePercent({ value: "٢٥٪", locale: "ar-EG" })).toBe(0.25);
        expect(parsePercent({ value: Number.NaN })).toBeUndefined();
        expect(() => parsePercent({ value: "1", locale: "" })).toThrow(
            RangeError,
        );
    });
});
