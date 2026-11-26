import { describe, expect, it } from "vitest";
import { formatTimeZoneName } from "../index.js";

describe("formatTimeZoneName", () => {
    it("defaults to the long name at the supplied instant", () => {
        expect(
            formatTimeZoneName({
                timeZone: "Asia/Kolkata",
                locale: "en-US",
                at: "2026-01-01T00:00:00Z",
            }),
        ).toBe("India Standard Time");
        expect(
            formatTimeZoneName({
                timeZone: "Asia/Kolkata",
                locale: "en-US",
                style: "long",
                at: "2026-01-01T00:00:00Z",
            }),
        ).toBe("India Standard Time");
        expect(
            formatTimeZoneName({
                timeZone: "Asia/Kolkata",
                locale: "en-US",
                style: "longOffset",
                at: "2026-01-01T00:00:00Z",
            }),
        ).toBe("GMT+05:30");
    });

    it("switches between standard time and daylight time", () => {
        expect(
            formatTimeZoneName({
                timeZone: "America/New_York",
                locale: "en-US",
                at: "2026-01-15T17:00:00Z",
            }),
        ).toBe("Eastern Standard Time");
        expect(
            formatTimeZoneName({
                timeZone: "America/New_York",
                locale: "en-US",
                style: "short",
                at: "2026-01-15T17:00:00Z",
            }),
        ).toBe("EST");
        expect(
            formatTimeZoneName({
                timeZone: "America/New_York",
                locale: "en-US",
                style: "shortOffset",
                at: "2026-01-15T17:00:00Z",
            }),
        ).toBe("GMT-5");
        expect(
            formatTimeZoneName({
                timeZone: "America/New_York",
                locale: "en-US",
                at: "2026-07-01T16:00:00Z",
            }),
        ).toBe("Eastern Daylight Time");
        expect(
            formatTimeZoneName({
                timeZone: "America/New_York",
                locale: "en-US",
                style: "short",
                at: "2026-07-01T16:00:00Z",
            }),
        ).toBe("EDT");
        expect(
            formatTimeZoneName({
                timeZone: "America/New_York",
                locale: "en-US",
                style: "shortOffset",
                at: "2026-07-01T16:00:00Z",
            }),
        ).toBe("GMT-4");
    });

    it("throws for an unknown zone, style, or instant", () => {
        expect(formatTimeZoneName({ timeZone: "Mars/Base" })).toBeUndefined();
        expect(() => formatTimeZoneName({ timeZone: "Mars/Base" })).toThrow(
            "IANA time zone",
        );
        expect(() =>
            formatTimeZoneName({
                timeZone: "UTC",
                style: "wide" as never,
                at: 0,
            }),
        ).toThrow(RangeError);
        expect(() =>
            formatTimeZoneName({
                timeZone: "UTC",
                style: "wide" as never,
                at: 0,
            }),
        ).toThrow("time zone name style");
        expect(() =>
            formatTimeZoneName({ timeZone: "UTC", at: "nope" }),
        ).toThrow(RangeError);
        expect(() =>
            formatTimeZoneName({ timeZone: "UTC", at: "nope" }),
        ).toThrow("valid date");
    });
});
