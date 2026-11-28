import { describe, expect, it } from "vitest";
import { isDate } from "../index.js";

/**
 * @param timeValue - The time value `getTime` returns.
 * @returns An object reported as a Date without this realm's prototype.
 */
function otherRealmDate(timeValue: number): Date {
    const date = Object.create(null) as Date;
    Object.defineProperty(date, Symbol.toStringTag, { value: "Date" });
    date.getTime = () => timeValue;
    return date;
}

describe("isDate", () => {
    it("accepts a Date, an Invalid Date, a subclass, and another realm", () => {
        class CalendarDate extends Date {}

        expect(isDate(new Date(0))).toBe(true);
        expect(isDate(new Date(Number.NaN))).toBe(true);
        expect(isDate(new CalendarDate(0))).toBe(true);
        expect(isDate(otherRealmDate(0))).toBe(true);
        expect(isDate(otherRealmDate(Number.NaN))).toBe(true);
    });

    it("rejects values that are not dates and does not throw", () => {
        const rejectedValues: readonly unknown[] = [
            null,
            undefined,
            0,
            "2024-02-29",
            { getTime: () => 0 },
            true,
        ];

        for (const rejectedValue of rejectedValues) {
            expect(isDate(rejectedValue)).toBe(false);
        }
    });
});
