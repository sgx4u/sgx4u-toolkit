import { describe, expect, it } from "vitest";
import { formatNumber, parseLocaleNumber } from "../index.js";

describe("parseLocaleNumber", () => {
    it("covers the documented behavior", () => {
        expect(
            parseLocaleNumber({ value: "12,34,567.89", locale: "en-IN" }),
        ).toBe(1234567.89);
        expect(parseLocaleNumber({ value: "1.234,56", locale: "de-DE" })).toBe(
            1234.56,
        );
        expect(parseLocaleNumber({ value: "1,234.5", locale: "en-US" })).toBe(
            1234.5,
        );
        expect(parseLocaleNumber({ value: "1 234,5", locale: "fr-FR" })).toBe(
            1234.5,
        );
        expect(parseLocaleNumber({ value: "١٬٢٣٤٫٥", locale: "ar-EG" })).toBe(
            1234.5,
        );
        expect(
            parseLocaleNumber({ value: "nope", locale: "en-US" }),
        ).toBeUndefined();
        expect(() => parseLocaleNumber({ value: "1", locale: "en-" })).toThrow(
            RangeError,
        );
        const locales = ["en-US", "en-IN", "de-DE", "fr-FR", "ja-JP"] as const;
        for (const locale of locales) {
            for (const value of [0, 1, -2, 12.5, 1234]) {
                const formatted = formatNumber({
                    value,
                    locale,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                });
                expect(
                    parseLocaleNumber({ value: formatted ?? "", locale }),
                ).toBe(value);
            }
        }
    });
});
