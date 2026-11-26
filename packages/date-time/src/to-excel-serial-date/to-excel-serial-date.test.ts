import { describe, expect, it } from "vitest";
import { toExcelSerialDate } from "../index.js";

const utc = { timeZone: "UTC" };

describe("toExcelSerialDate", () => {
    it("uses the 1900 system by default and never returns 60", () => {
        expect(toExcelSerialDate("1900-01-01T00:00:00Z", utc)).toBe(1);
        expect(toExcelSerialDate("1900-01-01T12:00:00Z", utc)).toBe(1.5);
        expect(toExcelSerialDate("1900-02-28T00:00:00Z", utc)).toBe(59);
        expect(toExcelSerialDate("1900-03-01T00:00:00Z", utc)).toBe(61);
        expect(toExcelSerialDate("2024-02-28T00:00:00Z", utc)).toBe(45_350);
        expect(toExcelSerialDate("2024-02-29T00:00:00Z", utc)).toBe(45_351);
        expect(toExcelSerialDate("2024-02-29T12:00:00Z", utc)).toBe(45_351.5);
        expect(toExcelSerialDate("2024-03-01T00:00:00Z", utc)).toBe(45_352);
        expect(toExcelSerialDate("9999-12-31T00:00:00Z", utc)).toBe(2_958_465);

        const aroundTheFictionalDay = [
            "1900-02-27T00:00:00Z",
            "1900-02-28T00:00:00Z",
            "1900-03-01T00:00:00Z",
            "1900-03-02T00:00:00Z",
            "2024-02-29T00:00:00Z",
        ].map((date) => toExcelSerialDate(date, utc));
        expect(aroundTheFictionalDay).not.toContain(60);
        expect(
            toExcelSerialDate("1900-03-01T00:00:00Z", utc) -
                toExcelSerialDate("1900-02-28T00:00:00Z", utc),
        ).toBe(2);
    });

    it("uses the 1904 system when asked and rejects dates before the epoch", () => {
        expect(
            toExcelSerialDate("1904-01-01T00:00:00Z", {
                ...utc,
                dateSystem: 1904,
            }),
        ).toBe(0);
        expect(
            toExcelSerialDate("1904-01-02T00:00:00Z", {
                ...utc,
                dateSystem: 1904,
            }),
        ).toBe(1);
        expect(
            toExcelSerialDate("1904-02-29T00:00:00Z", {
                ...utc,
                dateSystem: 1904,
            }),
        ).toBe(59);
        expect(
            toExcelSerialDate("1904-03-01T00:00:00Z", {
                ...utc,
                dateSystem: 1904,
            }),
        ).toBe(60);
        expect(() => toExcelSerialDate("1899-12-31T00:00:00Z", utc)).toThrow(
            RangeError,
        );
        expect(() =>
            toExcelSerialDate("1903-12-31T00:00:00Z", {
                ...utc,
                dateSystem: 1904,
            }),
        ).toThrow(RangeError);
        expect(() =>
            toExcelSerialDate("2024-02-29T00:00:00Z", {
                ...utc,
                dateSystem: 1899 as 1900,
            }),
        ).toThrow(RangeError);
    });

    it("uses the calendar day and time of day in the time zone", () => {
        const newYork = { timeZone: "America/New_York" };
        const dayFraction = (hour: number, minute = 0): number =>
            ((hour * 60 + minute) * 60 * 1000) / 86_400_000;

        expect(toExcelSerialDate("2024-01-15T05:00:00Z", newYork)).toBe(45_306);
        expect(toExcelSerialDate("2024-01-15T04:00:00Z", newYork)).toBe(
            45_305 + dayFraction(23),
        );
        expect(toExcelSerialDate("2024-07-15T04:00:00Z", newYork)).toBe(45_488);
        expect(toExcelSerialDate("2024-07-15T04:00:00Z", utc)).toBe(
            45_488 + dayFraction(4),
        );
        expect(toExcelSerialDate("2024-03-10T06:30:00Z", newYork)).toBe(
            45_361 + dayFraction(1, 30),
        );
        expect(toExcelSerialDate("2024-03-10T07:30:00Z", newYork)).toBe(
            45_361 + dayFraction(3, 30),
        );
        expect(toExcelSerialDate("1900-01-01T05:00:00Z", newYork)).toBe(1);
        expect(() =>
            toExcelSerialDate("1900-01-01T04:59:00Z", newYork),
        ).toThrow(RangeError);
        expect(
            toExcelSerialDate("2024-02-29T18:30:00Z", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(45_352);
    });

    it("throws when the date is invalid", () => {
        expect(() => toExcelSerialDate("2024-02-30", utc)).toThrow(RangeError);
        expect(() => toExcelSerialDate(new Date(Number.NaN), utc)).toThrow(
            RangeError,
        );
        expect(() => toExcelSerialDate(null as unknown as string, utc)).toThrow(
            TypeError,
        );
        expect(() =>
            toExcelSerialDate("2024-02-29T00:00:00Z", {
                timeZone: "Mars/Base",
            }),
        ).toThrow(RangeError);
    });
});
