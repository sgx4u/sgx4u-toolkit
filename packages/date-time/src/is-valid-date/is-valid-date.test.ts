import { describe, expect, it } from "vitest";
import { isValidDate, type DateInput } from "../index.js";

/**
 * A Date-shaped object whose prototype is not this realm's Date.
 *
 * @param timeValue - The time value `getTime` returns.
 * @returns An object `Object.prototype.toString` reports as a Date.
 */
function otherRealmDate(timeValue: number): Date {
    const date = Object.create(null) as Date;
    Object.defineProperty(date, Symbol.toStringTag, { value: "Date" });
    date.getTime = () => timeValue;
    return date;
}

const maximumTimeValue = 8_640_000_000_000_000;

const validCalendarDates = [
    "2024-01-31",
    "2024-02-29",
    "2023-02-28",
    "2024-03-31",
    "2024-04-30",
    "2024-05-31",
    "2024-06-30",
    "2024-07-31",
    "2024-08-31",
    "2024-09-30",
    "2024-10-31",
    "2024-11-30",
    "2024-12-31",
    "0000-01-01",
    "0000-02-29",
    "0004-02-29",
    "2000-02-29",
    "9999-12-31",
] as const;

const invalidCalendarDates = [
    "2024-02-30",
    "2023-02-29",
    "1900-02-29",
    "0100-02-29",
    "2024-00-01",
    "2024-13-01",
    "2024-01-00",
    "2024-01-32",
    "2024-04-31",
    "2024-06-31",
    "2024-09-31",
    "2024-11-31",
    "2024-2-29",
    "2024-02-9",
    "2024/02/29",
    "02-29-2024",
    "2024-02",
    "2024",
    " 2024-02-29",
    "2024-02-29 ",
    "2024-02-29\n",
    "",
    "   ",
    "1700000000000",
    "Feb 29, 2024",
    "+002024-02-29",
] as const;

const validDateTimes = [
    "2024-02-29T00:00Z",
    "2024-02-29T00:00:00Z",
    "2024-02-29T00:00:00.1Z",
    "2024-02-29T00:00:00.12Z",
    "2024-02-29T00:00:00.123Z",
    "2024-02-29t00:00:00z",
    "2024-02-29T23:59:59Z",
    "2024-02-29T00:00:00+00:00",
    "2024-02-29T00:00:00-00:00",
    "2024-02-29T00:00:00+05:30",
    "2024-02-29T00:00:00+0530",
    "2024-02-29T00:00:00-0800",
    "2024-02-29T00:00:00+0000",
    "2024-02-29T00:00:00-08:00",
    "2024-02-29T00:00:00+14:00",
    "2024-02-29T00:00:00+23:59",
    "2024-02-29T12:30:45.5Z",
    "0000-01-01T00:00:00.000Z",
    "9999-12-31T23:59:59.999Z",
] as const;

const invalidDateTimes = [
    "2024-02-30T00:00:00Z",
    "2023-02-29T00:00:00Z",
    "2024-02-29T24:00:00Z",
    "2024-02-29T23:60:00Z",
    "2024-02-29T23:59:60Z",
    "2024-02-29T23:59:59.1234Z",
    "2024-02-29T00:00:00",
    "2024-02-29 00:00:00Z",
    "2024-02-29T00:00:00+05",
    "2024-02-29T00:00:00+24:00",
    "2024-02-29T00:00:00+00:60",
    "2024-02-29T00:00.123Z",
    "2024-02-29T00:00:00.Z",
    "2024-02-29T00:00:00Z ",
    "2024-02-29T00:00:00 Z",
    "2024-02-29T00:00:00+5:30",
    "2024-13-01T00:00:00Z",
] as const;

describe("isValidDate", () => {
    it("accepts a DateInput and still rejects an invalid member", () => {
        const calendarDate: DateInput = "2024-02-29";
        const timestamp: DateInput = 0;
        const date: DateInput = new Date(0);
        const invalidMember: DateInput = "2024-02-30";

        expect(isValidDate(calendarDate)).toBe(true);
        expect(isValidDate(timestamp)).toBe(true);
        expect(isValidDate(date)).toBe(true);
        expect(isValidDate(invalidMember)).toBe(false);
    });

    describe("Date objects", () => {
        it("accepts a finite instant", () => {
            expect(isValidDate(new Date(0))).toBe(true);
            expect(isValidDate(new Date("2024-02-29T00:00:00.000Z"))).toBe(
                true,
            );
            expect(isValidDate(new Date(1.5))).toBe(true);
            expect(isValidDate(new Date(maximumTimeValue))).toBe(true);
            expect(isValidDate(new Date(-maximumTimeValue))).toBe(true);
        });

        it("rejects an Invalid Date", () => {
            expect(isValidDate(new Date(Number.NaN))).toBe(false);
            expect(isValidDate(new Date(""))).toBe(false);
            expect(isValidDate(new Date(Number.POSITIVE_INFINITY))).toBe(false);
            expect(isValidDate(new Date(maximumTimeValue + 1))).toBe(false);
            expect(isValidDate(new Date(-maximumTimeValue - 1))).toBe(false);
        });

        it("accepts a Date whose string already overflowed into a real instant", () => {
            expect(isValidDate("2024-02-30")).toBe(false);
            expect(isValidDate(new Date("2024-02-30"))).toBe(true);
        });

        it("accepts a Date created in another realm", () => {
            expect(isValidDate(otherRealmDate(0))).toBe(true);
            expect(isValidDate(otherRealmDate(Number.NaN))).toBe(false);
        });

        it("accepts a Date subclass with a finite time value", () => {
            class CalendarDate extends Date {}

            expect(isValidDate(new CalendarDate(0))).toBe(true);
            expect(isValidDate(new CalendarDate(Number.NaN))).toBe(false);
        });
    });

    describe("timestamps", () => {
        it("accepts a finite millisecond timestamp inside the Date range", () => {
            expect(isValidDate(0)).toBe(true);
            expect(isValidDate(-0)).toBe(true);
            expect(isValidDate(-1)).toBe(true);
            expect(isValidDate(1.5)).toBe(true);
            expect(isValidDate(1_704_067_200_000)).toBe(true);
            expect(isValidDate(maximumTimeValue)).toBe(true);
            expect(isValidDate(-maximumTimeValue)).toBe(true);
        });

        it("rejects a timestamp Date cannot store", () => {
            expect(isValidDate(Number.NaN)).toBe(false);
            expect(isValidDate(Number.POSITIVE_INFINITY)).toBe(false);
            expect(isValidDate(Number.NEGATIVE_INFINITY)).toBe(false);
            expect(isValidDate(Number.MAX_VALUE)).toBe(false);
            expect(isValidDate(maximumTimeValue + 1)).toBe(false);
            expect(isValidDate(-maximumTimeValue - 1)).toBe(false);
        });
    });

    describe("calendar dates", () => {
        it.each(validCalendarDates)("accepts %s", (value) => {
            expect(isValidDate(value)).toBe(true);
        });

        it.each(invalidCalendarDates)("rejects %s", (value) => {
            expect(isValidDate(value)).toBe(false);
        });
    });

    describe("date-time strings", () => {
        it.each(validDateTimes)("accepts %s", (value) => {
            expect(isValidDate(value)).toBe(true);
        });

        it.each(invalidDateTimes)("rejects %s", (value) => {
            expect(isValidDate(value)).toBe(false);
        });
    });

    describe("other values", () => {
        it("returns false and does not throw", () => {
            const rejectedValues: readonly unknown[] = [
                null,
                undefined,
                false,
                true,
                {},
                [],
                { getTime: () => 0 },
                new Number(0),
                new String("2024-02-29"),
                10n,
                Symbol("date"),
                () => new Date(),
            ];

            for (const rejectedValue of rejectedValues) {
                expect(isValidDate(rejectedValue)).toBe(false);
            }
        });
    });
});
