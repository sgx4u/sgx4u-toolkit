import { describe, expect, it } from "vitest";
import { parseCurrency } from "../index.js";

describe("parseCurrency", () => {
    it("covers the documented behavior", () => {
        expect(
            parseCurrency({
                value: "₹1,00,000",
                locale: "en-IN",
                currency: "INR",
            }),
        ).toBe(100000);
        expect(
            parseCurrency({
                value: "1.234,56 €",
                locale: "de-DE",
                currency: "EUR",
            }),
        ).toBe(1234.56);
        expect(
            parseCurrency({
                value: "$1,234.50",
                locale: "en-US",
                currency: "USD",
            }),
        ).toBe(1234.5);
        expect(() => parseCurrency({ value: "1", currency: "US" })).toThrow(
            RangeError,
        );
        expect(() => parseCurrency({ value: "1", locale: "bad tag" })).toThrow(
            RangeError,
        );
    });
});
