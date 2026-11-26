import { describe, expect, it } from "vitest";
import { formatRfc2822Date } from "../index.js";

describe("formatRfc2822Date", () => {
    it("formats a numeric offset in the requested zone", () => {
        expect(
            formatRfc2822Date("2026-11-25T22:00:00.000Z", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("Thu, 26 Nov 2026 03:30:00 +0530");
        expect(
            formatRfc2822Date("2026-07-01T16:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe("Wed, 01 Jul 2026 12:00:00 -0400");
        expect(
            formatRfc2822Date("2026-01-15T17:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe("Thu, 15 Jan 2026 12:00:00 -0500");
    });

    it("crosses a leap day and a year boundary", () => {
        expect(
            formatRfc2822Date("2024-02-29T23:59:59Z", { timeZone: "UTC" }),
        ).toBe("Thu, 29 Feb 2024 23:59:59 +0000");
        expect(
            formatRfc2822Date("2026-12-31T23:30:00Z", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("Fri, 01 Jan 2027 05:00:00 +0530");
    });

    it("uses the system zone when timeZone is omitted", () => {
        expect(formatRfc2822Date("2026-11-26")).toMatch(
            /^Thu, 26 Nov 2026 00:00:00 [+-]\d{4}$/,
        );
    });

    it("throws when the date or zone is unusable", () => {
        expect(() => formatRfc2822Date("nope", { timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => formatRfc2822Date("nope", { timeZone: "UTC" })).toThrow(
            '`date` must be a valid date; received "nope".',
        );
        expect(() => formatRfc2822Date(0, { timeZone: "Mars/Base" })).toThrow(
            RangeError,
        );
        expect(() => formatRfc2822Date(0, { timeZone: "Mars/Base" })).toThrow(
            "IANA time zone",
        );
    });
});
