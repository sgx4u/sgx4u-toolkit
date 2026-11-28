import { describe, expect, it } from "vitest";
import { formatCurrency } from "../index.js";

describe("formatCurrency", () => {
    it("covers the documented behavior", () => {
        const text = formatCurrency({
            value: 12,
            currency: "USD",
            locale: "en-US",
        });
        expect(text).toBe(
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(12),
        );
        expect(
            formatCurrency({ value: 12.4, currency: "JPY", locale: "ja-JP" }),
        ).toBe(
            new Intl.NumberFormat("ja-JP", {
                style: "currency",
                currency: "JPY",
            }).format(12.4),
        );
        expect(
            formatCurrency({
                value: -1,
                currency: "USD",
                locale: "en-US",
                currencySign: "accounting",
            }),
        ).toBe(
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                currencySign: "accounting",
            }).format(-1),
        );
        expect(
            formatCurrency({ value: Number.NaN, currency: "USD" }),
        ).toBeUndefined();
        expect(() => formatCurrency({ value: 1, currency: "US" })).toThrow(
            RangeError,
        );
    });
});
