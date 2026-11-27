import { describe, expect, it } from "vitest";
import { formatNumber } from "../index.js";

describe("formatNumber", () => {
    it("covers the documented behavior", () => {
        expect(formatNumber({ value: 1234.5, locale: "en-US" })).toBe(
            new Intl.NumberFormat("en-US").format(1234.5),
        );
        expect(
            formatNumber({
                value: 1200000,
                locale: "en-IN",
                notation: "compact",
            }),
        ).toBe(
            new Intl.NumberFormat("en-IN", { notation: "compact" }).format(
                1200000,
            ),
        );
        expect(formatNumber({ value: Number.NaN })).toBeUndefined();
        expect(() => formatNumber({ value: 1, locale: "en-" })).toThrow(
            RangeError,
        );
        expect(() =>
            formatNumber({ value: 1, numberingSystem: "nope" }),
        ).toThrow(RangeError);
        expect(() =>
            formatNumber({ value: 1, roundingMode: "nope" as "halfEven" }),
        ).toThrow(RangeError);
    });
});
