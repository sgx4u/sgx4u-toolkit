import { describe, expect, it } from "vitest";
import { parseRFC2822Date } from "../index.js";

describe("parseRFC2822Date", () => {
    it("parses a numeric offset, with the weekday and seconds optional", () => {
        expect(
            parseRFC2822Date("Thu, 26 Nov 2026 03:30:00 +0530")?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(parseRFC2822Date("26 Nov 2026 03:30 +0530")?.toISOString()).toBe(
            "2026-11-25T22:00:00.000Z",
        );
        expect(
            parseRFC2822Date("Fri, 26 Nov 2026 00:00:00 GMT")?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            parseRFC2822Date("  26 Nov 2026 00:00:00 +0000")?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            parseRFC2822Date("26 nov 2026 00:00:00 gmt")?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
    });

    it("accepts obsolete zones, two-digit years, leap day, and the year bounds", () => {
        expect(
            parseRFC2822Date("26 Nov 2026 12:00:00 EST")?.toISOString(),
        ).toBe("2026-11-26T17:00:00.000Z");
        expect(
            parseRFC2822Date("26 Nov 2026 12:00:00 PDT")?.toISOString(),
        ).toBe("2026-11-26T19:00:00.000Z");
        expect(parseRFC2822Date("26 Nov 2026 00:00:00 UT")?.toISOString()).toBe(
            "2026-11-26T00:00:00.000Z",
        );
        expect(parseRFC2822Date("26 Nov 99 00:00:00 GMT")?.toISOString()).toBe(
            "1999-11-26T00:00:00.000Z",
        );
        expect(parseRFC2822Date("01 Jan 00 00:00:00 GMT")?.toISOString()).toBe(
            "2000-01-01T00:00:00.000Z",
        );
        expect(
            parseRFC2822Date("29 Feb 2024 00:00:00 GMT")?.toISOString(),
        ).toBe("2024-02-29T00:00:00.000Z");
        expect(
            parseRFC2822Date("01 Jan 0000 00:00:00 +0000")?.toISOString(),
        ).toBe("0000-01-01T00:00:00.000Z");
        expect(
            parseRFC2822Date("31 Dec 9999 23:59:59 +0000")?.toISOString(),
        ).toBe("9999-12-31T23:59:59.000Z");
    });

    it("returns undefined for text that is not a real email date", () => {
        const rejected = [
            "",
            "not a date",
            "30 Feb 2024 00:00:00 GMT",
            "31 Apr 2026 00:00:00 GMT",
            "32 Nov 2026 00:00:00 GMT",
            "26 Nov 2026 24:00:00 GMT",
            "26 Nov 2026 00:00:00 +2400",
            "26 Nov 2026 00:00:00 +0060",
            "26 Nov 2026",
            "Thu, 26 Nov 2026 00:00:00 Z",
        ];

        for (const value of rejected) {
            expect(parseRFC2822Date(value)).toBeUndefined();
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() => parseRFC2822Date(undefined as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseRFC2822Date(false as unknown as string)).toThrow(
            "`value` must be a string; received false.",
        );
    });
});
