import { describe, expect, it } from "vitest";
import { getUtcOffset } from "../index.js";

describe("getUtcOffset", () => {
    it("returns whole-minute offsets for modern zones", () => {
        expect(getUtcOffset("2024-06-15T12:00:00Z", "Asia/Kolkata")).toBe(330);
        expect(getUtcOffset("2024-06-15T12:00:00Z", "UTC")).toBe(0);
        expect(getUtcOffset("2024-01-15T12:00:00Z", "America/New_York")).toBe(
            -300,
        );
        expect(getUtcOffset("2024-07-15T12:00:00Z", "America/New_York")).toBe(
            -240,
        );
        expect(getUtcOffset("2024-06-15T00:00:00Z", "+05:30")).toBe(330);
    });

    it("keeps a fractional historical offset", () => {
        expect(
            getUtcOffset("1904-06-01T17:32:11.000Z", "America/Detroit"),
        ).toBeCloseTo(-332.1833333333, 6);
        expect(
            getUtcOffset("1900-01-01T00:00:00.000Z", "Asia/Kolkata"),
        ).toBeCloseTo(321.1666666667, 6);
    });

    it("does not change the input date", () => {
        const date = new Date("2024-06-15T12:00:00.000Z");
        const timeValue = date.getTime();

        getUtcOffset(date, "UTC");

        expect(date.getTime()).toBe(timeValue);
    });

    it("throws for a bad date or a bad zone", () => {
        expect(() => getUtcOffset("nope", "UTC")).toThrow(RangeError);
        expect(() => getUtcOffset("nope", "UTC")).toThrow(
            '`date` must be a valid date; received "nope".',
        );
        expect(() => getUtcOffset("2024-06-15T00:00:00Z", "Mars/Base")).toThrow(
            '`timeZone` must be an IANA time zone or ±HH:mm offset; received "Mars/Base".',
        );
        expect(() =>
            getUtcOffset("2024-06-15T00:00:00Z", 5 as unknown as string),
        ).toThrow(TypeError);
    });
});
