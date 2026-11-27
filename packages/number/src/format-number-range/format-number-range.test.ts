import { describe, expect, it } from "vitest";
import { formatNumberRange } from "../index.js";

describe("formatNumberRange", () => {
    it("covers the documented behavior", () => {
        expect(formatNumberRange({ start: 1, end: 2, locale: "en-US" })).toBe(
            new Intl.NumberFormat("en-US").formatRange(1, 2),
        );
        const original = Intl.NumberFormat.prototype.formatRange;
        Object.defineProperty(Intl.NumberFormat.prototype, "formatRange", {
            configurable: true,
            value: undefined,
        });
        expect(formatNumberRange({ start: 1, end: 2, locale: "en-US" })).toBe(
            "1\u20132",
        );
        Object.defineProperty(Intl.NumberFormat.prototype, "formatRange", {
            configurable: true,
            value: original,
        });
        expect(
            formatNumberRange({ start: Number.NaN, end: 1 }),
        ).toBeUndefined();
    });
});
