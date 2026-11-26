import { describe, expect, it } from "vitest";
import { fromExcelSerialDate, toExcelSerialDate } from "../index.js";

describe("fromExcelSerialDate", () => {
    it("maps serial 1 to 1900-01-01 and treats 60 and 61 as 1900-03-01", () => {
        expect(fromExcelSerialDate(1, { timeZone: "UTC" }).toISOString()).toBe(
            "1900-01-01T00:00:00.000Z",
        );
        expect(fromExcelSerialDate(59, { timeZone: "UTC" }).toISOString()).toBe(
            "1900-02-28T00:00:00.000Z",
        );
        expect(fromExcelSerialDate(60, { timeZone: "UTC" }).toISOString()).toBe(
            "1900-03-01T00:00:00.000Z",
        );
        expect(fromExcelSerialDate(61, { timeZone: "UTC" }).toISOString()).toBe(
            "1900-03-01T00:00:00.000Z",
        );
        expect(
            fromExcelSerialDate(60.5, { timeZone: "UTC" }).toISOString(),
        ).toBe("1900-03-01T12:00:00.000Z");
        expect(
            toExcelSerialDate("1900-02-28T00:00:00Z", { timeZone: "UTC" }),
        ).toBe(59);
        expect(
            toExcelSerialDate("1900-03-01T00:00:00Z", { timeZone: "UTC" }),
        ).toBe(61);
        expect(
            toExcelSerialDate(fromExcelSerialDate(60, { timeZone: "UTC" }), {
                timeZone: "UTC",
            }),
        ).toBe(61);
    });

    it("defaults to the 1900 system and accepts the 1904 leap day", () => {
        expect(fromExcelSerialDate(61, { timeZone: "UTC" }).toISOString()).toBe(
            fromExcelSerialDate(61, {
                timeZone: "UTC",
                dateSystem: 1900,
            }).toISOString(),
        );
        expect(
            fromExcelSerialDate(0, {
                timeZone: "UTC",
                dateSystem: 1904,
            }).toISOString(),
        ).toBe("1904-01-01T00:00:00.000Z");
        expect(
            fromExcelSerialDate(60, {
                timeZone: "UTC",
                dateSystem: 1904,
            }).toISOString(),
        ).toBe("1904-03-01T00:00:00.000Z");
    });

    it("reads the serial as wall time in a zone", () => {
        expect(
            fromExcelSerialDate(46204, {
                timeZone: "America/New_York",
            }).toISOString(),
        ).toBe("2026-07-01T04:00:00.000Z");
        expect(
            fromExcelSerialDate(46113, {
                timeZone: "Asia/Kolkata",
            }).toISOString(),
        ).toBe("2026-03-31T18:30:00.000Z");
    });

    it("throws for a serial before the epoch or a bad date system", () => {
        expect(() => fromExcelSerialDate(0, { timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => fromExcelSerialDate(0, { timeZone: "UTC" })).toThrow(
            "at least 1 in the 1900 date system",
        );
        expect(() =>
            fromExcelSerialDate(-1, { timeZone: "UTC", dateSystem: 1904 }),
        ).toThrow(RangeError);
        expect(() =>
            fromExcelSerialDate(-1, { timeZone: "UTC", dateSystem: 1904 }),
        ).toThrow("at least 0 in the 1904 date system");
        expect(() => fromExcelSerialDate("61" as never)).toThrow(TypeError);
        expect(() => fromExcelSerialDate("61" as never)).toThrow(
            "`serial` must be a number",
        );
        expect(() =>
            fromExcelSerialDate(1, { dateSystem: 1899 as never }),
        ).toThrow(RangeError);
        expect(() =>
            fromExcelSerialDate(1, { dateSystem: 1899 as never }),
        ).toThrow("1900 or 1904");
    });
});
