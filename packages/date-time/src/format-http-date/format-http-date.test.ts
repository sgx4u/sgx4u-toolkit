import { describe, expect, it } from "vitest";
import { formatHttpDate } from "../index.js";

describe("formatHttpDate", () => {
    it("writes an IMF-fixdate in GMT", () => {
        expect(formatHttpDate("2026-11-26T22:00:00.000Z")).toBe(
            "Thu, 26 Nov 2026 22:00:00 GMT",
        );
    });

    it("writes leap day and the first second of the next year without rounding milliseconds up", () => {
        expect(formatHttpDate("2024-02-29T00:00:00.000Z")).toBe(
            "Thu, 29 Feb 2024 00:00:00 GMT",
        );
        expect(formatHttpDate("2024-02-29T23:59:59.999Z")).toBe(
            "Thu, 29 Feb 2024 23:59:59 GMT",
        );
        expect(formatHttpDate("2025-01-01T00:00:00.000Z")).toBe(
            "Wed, 01 Jan 2025 00:00:00 GMT",
        );
    });

    it("rejects text that is not a date and an invalid Date", () => {
        expect(() => formatHttpDate("nope")).toThrow(RangeError);
        expect(() => formatHttpDate("nope")).toThrow(
            '`date` must be a valid date; received "nope".',
        );
        expect(() => formatHttpDate(new Date(Number.NaN))).toThrow(
            "`date` must be a valid date; received Invalid Date.",
        );
    });
});
