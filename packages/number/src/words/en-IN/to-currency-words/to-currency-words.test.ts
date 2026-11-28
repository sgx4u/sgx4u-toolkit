import { describe, expect, it } from "vitest";
import { toCurrencyWords } from "../../en-IN.js";

describe("toCurrencyWords en-IN", () => {
    it("covers the documented behavior", () => {
        expect(
            toCurrencyWords({
                value: 100000,
                currency: "INR",
                style: "cheque",
            }),
        ).toBe("Rupees One Lakh Only");
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
