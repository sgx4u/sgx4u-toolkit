import { describe, expect, it } from "vitest";
import { parseHttpDate } from "../index.js";

const longWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;

/**
 * Century used for an RFC 850 year, matching `parseHttpDateText`.
 *
 * @param year - The two-digit year.
 * @param now - The instant the parser uses for the window.
 * @returns The four-digit year.
 */
function expandRfc850Year(year: number, now: number): number {
    if (year >= 50) {
        return 1900 + year;
    }
    const candidate = 2000 + year;
    const currentYear = new Date(now).getUTCFullYear();
    if (candidate - currentYear > 50) {
        return 1900 + year;
    }
    return candidate;
}

describe("parseHttpDate", () => {
    it("parses IMF-fixdate, including leap day and the year bounds", () => {
        expect(
            parseHttpDate("Thu, 26 Nov 2026 22:00:00 GMT")?.toISOString(),
        ).toBe("2026-11-26T22:00:00.000Z");
        expect(
            parseHttpDate("Thu, 29 Feb 2024 00:00:00 GMT")?.toISOString(),
        ).toBe("2024-02-29T00:00:00.000Z");
        expect(
            parseHttpDate("Sat, 01 Jan 0000 00:00:00 GMT")?.toISOString(),
        ).toBe("0000-01-01T00:00:00.000Z");
        expect(
            parseHttpDate("Fri, 31 Dec 9999 23:59:59 GMT")?.toISOString(),
        ).toBe("9999-12-31T23:59:59.000Z");
        expect(
            parseHttpDate("Thu, 01 Jan 1970 00:00:00 GMT")?.toISOString(),
        ).toBe("1970-01-01T00:00:00.000Z");
    });

    it("parses RFC 850 and asctime", () => {
        expect(
            parseHttpDate("Thursday, 01-Jan-70 00:00:00 GMT")?.toISOString(),
        ).toBe("1970-01-01T00:00:00.000Z");

        const year = expandRfc850Year(26, Date.now());
        const november = new Date(Date.UTC(year, 10, 26));
        const weekday = longWeekdays[november.getUTCDay()];
        expect(
            parseHttpDate(`${weekday}, 26-Nov-26 00:00:00 GMT`)?.toISOString(),
        ).toBe(november.toISOString());

        expect(parseHttpDate("Thu Nov 26 22:00:00 2026")?.toISOString()).toBe(
            "2026-11-26T22:00:00.000Z",
        );
        expect(parseHttpDate("Thu Nov  5 00:00:00 2026")?.toISOString()).toBe(
            "2026-11-05T00:00:00.000Z",
        );
    });

    it("returns undefined for text that does not match", () => {
        const rejected = [
            "",
            "   ",
            "Fri, 26 Nov 2026 22:00:00 GMT",
            "Thu, 30 Feb 2024 00:00:00 GMT",
            "Thu, 31 Apr 2026 00:00:00 GMT",
            "thu, 26 Nov 2026 22:00:00 GMT",
            "Thu, 26 Nov 2026 24:00:00 GMT",
            "Thu, 26 Nov 2026 22:00:00 UTC",
            "Friday, 26-Nov-26 22:00:00 GMT",
            "Thu Nov 26 22:00:00 2026 ",
            "not a date",
        ];

        for (const value of rejected) {
            expect(parseHttpDate(value)).toBeUndefined();
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() => parseHttpDate(undefined as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseHttpDate(0 as unknown as string)).toThrow(
            "`value` must be a string; received 0.",
        );
    });
});
