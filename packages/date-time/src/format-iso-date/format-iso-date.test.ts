import { describe, expect, it } from "vitest";
import {
    formatHTTPDate,
    formatRFC2822Date,
    fromExcelSerialDate,
    formatISODate,
    formatISODateTime,
    fromJulianDate,
    fromUnixSeconds,
    parseISODate,
    parseHTTPDate,
    parseRFC2822Date,
    parseISODateTime,
    reviveISODateTimes,
    toExcelSerialDate,
    toJulianDate,
    toUnixSeconds,
} from "../index.js";

describe("ISO interchange", () => {
    it("formats the zone's calendar date and offset", () => {
        expect(
            formatISODate({
                date: "2026-11-25T22:00:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("2026-11-26");
        expect(
            formatISODateTime({
                date: "2026-11-25T22:00:00.000Z",
                timeZone: "Asia/Kolkata",
                precision: "minute",
            }),
        ).toBe("2026-11-26T03:30+05:30");
        expect(
            formatISODateTime({
                date: "2026-11-25T22:00:00.000Z",
                timeZone: "UTC",
                includeTimeZoneName: true,
            }),
        ).toBe("2026-11-25T22:00:00.000Z[UTC]");
    });

    it("parses calendar dates, offsets, and a disagreeing zone", () => {
        expect(
            parseISODate({
                value: "2026-11-26",
                timeZone: "Asia/Kolkata",
            })?.toISOString(),
        ).toBe("2026-11-25T18:30:00.000Z");
        expect(parseISODate({ value: "2026-02-30" })).toBeUndefined();
        expect(
            parseISODateTime({
                value: "2026-11-26T03:30:00+0530",
            })?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseISODateTime({ value: "2026-11-26T03:30:00.1239Z" })?.getTime(),
        ).toBe(Date.parse("2026-11-26T03:30:00.123Z"));
        expect(
            parseISODateTime({ value: "2026-11-26T03:30:00" }),
        ).toBeUndefined();
        expect(
            parseISODateTime({
                value: "2026-11-26T03:30:00",
                defaultTimeZone: "Asia/Kolkata",
            })?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseISODateTime({
                value: "2026-11-26T03:30:00+05:30[Asia/Kolkata]",
            })?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseISODateTime({
                value: "2026-11-26T03:30:00+00:00[Asia/Kolkata]",
            }),
        ).toBeUndefined();
    });

    it("converts Unix seconds and Julian Dates, and revives offset strings", () => {
        expect(toUnixSeconds("1970-01-01T00:00:01.900Z")).toBe(1);
        expect(toUnixSeconds(-1500)).toBe(-2);
        expect(fromUnixSeconds(0).toISOString()).toBe(
            "1970-01-01T00:00:00.000Z",
        );
        expect(toJulianDate(0)).toBe(2_440_587.5);
        expect(fromJulianDate(2_440_587.5).getTime()).toBe(0);
        const revived = JSON.parse(
            JSON.stringify({
                at: "2026-11-26T03:30:00+05:30",
                day: "2026-11-26",
            }),
            reviveISODateTimes,
        ) as { at: Date; day: string };
        expect(revived.at.toISOString()).toBe("2026-11-25T22:00:00.000Z");
        expect(revived.day).toBe("2026-11-26");
    });

    it("formats HTTP dates and spreadsheet serials", () => {
        expect(formatHTTPDate("2026-11-26T22:00:00.000Z")).toBe(
            "Thu, 26 Nov 2026 22:00:00 GMT",
        );
        expect(
            parseHTTPDate("Thu, 26 Nov 2026 22:00:00 GMT")?.toISOString(),
        ).toBe("2026-11-26T22:00:00.000Z");
        expect(parseHTTPDate("not a date")).toBeUndefined();
        expect(
            toExcelSerialDate({
                date: "1900-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(61);
        expect(
            toExcelSerialDate({
                date: "1900-01-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(1);
        expect(
            fromExcelSerialDate({ serial: 60, timeZone: "UTC" })?.toISOString(),
        ).toBe("1900-03-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({ serial: 61, timeZone: "UTC" })?.toISOString(),
        ).toBe("1900-03-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({
                serial: 0,
                timeZone: "UTC",
                dateSystem: 1904,
            })?.toISOString(),
        ).toBe("1904-01-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({ serial: 0, timeZone: "UTC" }),
        ).toBeUndefined();
        expect(
            formatRFC2822Date({
                date: "2026-11-25T22:00:00.000Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("Thu, 26 Nov 2026 03:30:00 +0530");
        expect(
            parseRFC2822Date("Thu, 26 Nov 2026 03:30:00 +0530")?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(parseRFC2822Date("26 Nov 2026 03:30 EST")?.toISOString()).toBe(
            "2026-11-26T08:30:00.000Z",
        );
    });
});
