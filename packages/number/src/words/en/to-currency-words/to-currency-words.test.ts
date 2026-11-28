import { describe, expect, it } from "vitest";
import { toCurrencyWords } from "../../en.js";

describe("toCurrencyWords en", () => {
    it("covers the documented behavior", () => {
        expect(toCurrencyWords({ value: 1, currency: "USD" })).toBe(
            "one dollar",
        );
        expect(toCurrencyWords({ value: 2, currency: "INR" })).toContain(
            "rupees",
        );
        expect(() => toCurrencyWords({ value: 1, currency: "US" })).toThrow(
            RangeError,
        );
    });
});
