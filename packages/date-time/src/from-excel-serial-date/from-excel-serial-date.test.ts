import { describe, expect, it } from "vitest";
import { fromExcelSerialDate, toExcelSerialDate } from "../index.js";

describe("fromExcelSerialDate", () => {
    it("maps serial 1 to 1900-01-01 and treats 60 and 61 as 1900-03-01", () => {
        expect(
            fromExcelSerialDate({ serial: 1, timeZone: "UTC" })?.toISOString(),
        ).toBe("1900-01-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({ serial: 59, timeZone: "UTC" })?.toISOString(),
        ).toBe("1900-02-28T00:00:00.000Z");
        expect(
            fromExcelSerialDate({ serial: 60, timeZone: "UTC" })?.toISOString(),
        ).toBe("1900-03-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({ serial: 61, timeZone: "UTC" })?.toISOString(),
        ).toBe("1900-03-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({
                serial: 60.5,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("1900-03-01T12:00:00.000Z");
        expect(
            toExcelSerialDate({
                date: "1900-02-28T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(59);
        expect(
            toExcelSerialDate({
                date: "1900-03-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(61);
        const leapDay = fromExcelSerialDate({ serial: 60, timeZone: "UTC" });
        expect(leapDay).toBeDefined();
        expect(
            toExcelSerialDate({
                date: leapDay!,
                timeZone: "UTC",
            }),
        ).toBe(61);
    });

    it("defaults to the 1900 system and accepts the 1904 leap day", () => {
        expect(
            fromExcelSerialDate({ serial: 61, timeZone: "UTC" })?.toISOString(),
        ).toBe(
            fromExcelSerialDate({
                serial: 61,
                timeZone: "UTC",
                dateSystem: 1900,
            })?.toISOString(),
        );
        expect(
            fromExcelSerialDate({
                serial: 0,
                timeZone: "UTC",
                dateSystem: 1904,
            })?.toISOString(),
        ).toBe("1904-01-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate({
                serial: 60,
                timeZone: "UTC",
                dateSystem: 1904,
            })?.toISOString(),
        ).toBe("1904-03-01T00:00:00.000Z");
    });

    it("reads the serial as wall time in a zone", () => {
        expect(
            fromExcelSerialDate({
                serial: 46204,
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2026-07-01T04:00:00.000Z");
        expect(
            fromExcelSerialDate({
                serial: 46113,
                timeZone: "Asia/Kolkata",
            })?.toISOString(),
        ).toBe("2026-03-31T18:30:00.000Z");
    });

    it("returns undefined for a serial before the epoch or a bad serial", () => {
        expect(fromExcelSerialDate({ serial: 0, timeZone: "UTC" })).toBe(
            undefined,
        );
        expect(
            fromExcelSerialDate({
                serial: -1,
                timeZone: "UTC",
                dateSystem: 1904,
            }),
        ).toBeUndefined();
        expect(fromExcelSerialDate({ serial: "61" as never })).toBeUndefined();
    });

    it("throws for a bad date system", () => {
        expect(() =>
            fromExcelSerialDate({ serial: 1, dateSystem: 1899 as never }),
        ).toThrow(RangeError);
        expect(() =>
            fromExcelSerialDate({ serial: 1, dateSystem: 1899 as never }),
        ).toThrow("1900 or 1904");
    });
});
