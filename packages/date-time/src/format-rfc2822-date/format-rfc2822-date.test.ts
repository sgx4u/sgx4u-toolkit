import { describe, expect, it } from "vitest";
import { formatRFC2822Date } from "../index.js";

describe("formatRFC2822Date", () => {
    it("formats a numeric offset in the requested zone", () => {
        expect(
            formatRFC2822Date({
                date: "2026-11-25T22:00:00.000Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("Thu, 26 Nov 2026 03:30:00 +0530");
        expect(
            formatRFC2822Date({
                date: "2026-07-01T16:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe("Wed, 01 Jul 2026 12:00:00 -0400");
        expect(
            formatRFC2822Date({
                date: "2026-01-15T17:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe("Thu, 15 Jan 2026 12:00:00 -0500");
    });

    it("crosses a leap day and a year boundary", () => {
        expect(
            formatRFC2822Date({
                date: "2024-02-29T23:59:59Z",
                timeZone: "UTC",
            }),
        ).toBe("Thu, 29 Feb 2024 23:59:59 +0000");
        expect(
            formatRFC2822Date({
                date: "2026-12-31T23:30:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("Fri, 01 Jan 2027 05:00:00 +0530");
    });

    it("uses the system zone when timeZone is omitted", () => {
        expect(formatRFC2822Date({ date: "2026-11-26" })).toMatch(
            /^Thu, 26 Nov 2026 00:00:00 [+-]\d{4}$/,
        );
    });

    it("throws when the date or zone is unusable", () => {
        expect(
            formatRFC2822Date({ date: "nope", timeZone: "UTC" }),
        ).toBeUndefined();
        expect(() =>
            formatRFC2822Date({ date: 0, timeZone: "Mars/Base" }),
        ).toThrow(RangeError);
        expect(() =>
            formatRFC2822Date({ date: 0, timeZone: "Mars/Base" }),
        ).toThrow("IANA time zone");
    });
});
