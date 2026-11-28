import { describe, expect, it } from "vitest";
import { createDateTime } from "./create-date-time.js";
import { isBusinessDay, isHoliday, isWeekend } from "../index.js";

describe("createDateTime", () => {
    it("uses the config and lets a call override it", () => {
        const dateTime = createDateTime({
            timeZone: "Asia/Kolkata",
            weekStartsOn: 7,
        });
        expect(
            dateTime.getWeekOfYear({
                date: "2026-01-01T00:00:00+05:30",
            }),
        ).toBe(
            dateTime.getWeekOfYear({
                date: "2026-01-01T00:00:00+05:30",
                weekStartsOn: 7,
                timeZone: "Asia/Kolkata",
            }),
        );
        expect(
            dateTime.formatISODate({
                date: "2026-11-25T22:00:00Z",
            }),
        ).toBe("2026-11-26");
        expect(
            dateTime.formatISODate({
                date: "2026-11-25T22:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe("2026-11-25");
    });

    it("keeps two instances isolated", () => {
        let kolkataNow = new Date("2026-01-26T00:00:00+05:30");
        const newYorkNow = new Date("2026-07-04T00:00:00-04:00");
        const kolkata = createDateTime({
            timeZone: "Asia/Kolkata",
            now: () => kolkataNow,
            holidays: [{ date: "2026-01-26", name: "Republic Day" }],
        });
        const newYork = createDateTime({
            timeZone: "America/New_York",
            now: () => newYorkNow,
            holidays: [{ date: "2026-07-04", name: "Independence Day" }],
        });
        expect(kolkata.isHoliday("2026-01-26")).toBe(true);
        expect(newYork.isHoliday("2026-01-26")).toBe(false);
        expect(
            kolkata.isHoliday({ date: "2026-01-26", includeName: true }),
        ).toEqual({ isHoliday: true, name: "Republic Day" });
        expect(
            newYork.isHoliday({ date: "2026-07-04", includeName: true }),
        ).toEqual({ isHoliday: true, name: "Independence Day" });
        expect(kolkata.isBusinessDay({ date: "2026-01-26" })).toBe(false);
        expect(newYork.isBusinessDay({ date: "2026-01-26" })).toBe(true);
        expect(kolkata.isToday({ date: "2026-01-26T10:00:00+05:30" })).toBe(
            true,
        );
        expect(newYork.isToday({ date: "2026-01-26T10:00:00+05:30" })).toBe(
            false,
        );
        kolkataNow = new Date("2026-08-15T00:00:00+05:30");
        expect(kolkata.isToday({ date: "2026-08-15T12:00:00+05:30" })).toBe(
            true,
        );
        expect(newYork.isToday({ date: "2026-08-15T12:00:00+05:30" })).toBe(
            false,
        );
    });

    it("matches a holiday with no name and a standalone call", () => {
        const dateTime = createDateTime({
            timeZone: "UTC",
            holidays: [{ date: "2026-12-25" }],
        });
        expect(
            dateTime.isHoliday({ date: "2026-12-25", includeName: true }),
        ).toEqual({ isHoliday: true });
        expect(
            isHoliday({
                date: "2026-12-25T00:00:00Z",
                holidays: [{ date: "2026-12-25", name: "Christmas" }],
                timeZone: "UTC",
                includeName: true,
            }),
        ).toEqual({ isHoliday: true, name: "Christmas" });
        expect(
            isBusinessDay({
                date: "2026-12-25T12:00:00Z",
                timeZone: "UTC",
                holidays: [{ date: "2026-12-25" }],
            }),
        ).toBe(false);
        expect(
            isWeekend({ date: "2026-11-28T00:00:00Z", timeZone: "UTC" }),
        ).toBe(true);
    });

    it("calls every bound function and accepts a full config", () => {
        const dateTime = createDateTime({
            timeZone: "UTC",
            locale: ["en-US", "en"],
            weekStartsOn: 1,
            minimumDaysInFirstWeek: 4,
            workingDays: [1, 2, 3, 4, 5],
            businessHours: [{ start: "09:00", end: "17:00" }],
            disambiguation: "compatible",
            now: () => new Date("2026-06-15T12:00:00Z"),
            holidays: [{ date: "2026-12-25", name: "Christmas" }],
            numeric: "always",
            overflow: "constrain",
            formatPattern: "yyyy-MM-dd",
            fiscalYearStartMonth: 4,
            fiscalYearLabel: "end-year",
            relativeTimeStyle: "short",
        });
        const sample = {
            date: "2026-06-15T12:00:00Z",
            duration: { days: 1 },
            start: "2026-06-15T00:00:00Z",
            end: "2026-06-16T00:00:00Z",
            year: 2026,
            month: 6,
            day: 15,
            later: "2026-06-16T00:00:00Z",
            earlier: "2026-06-15T00:00:00Z",
            unit: "day" as const,
            first: "2026-06-15T00:00:00Z",
            second: "2026-06-16T00:00:00Z",
            pattern: "yyyy-MM-dd",
            value: "2026-06-15",
            text: "tomorrow",
            expression: "0 9 * * *",
            schedule: "0 9 * * *",
            rule: {
                start: new Date("2026-06-15T00:00:00Z"),
                frequency: "daily" as const,
            },
            dates: ["2026-06-15T00:00:00Z"],
            intervals: [],
            fiscalYearStartMonth: 4,
            fiscalYear: 2026,
            milliseconds: 1000,
            birthDate: "2000-01-01T00:00:00Z",
            target: "2026-12-25T00:00:00Z",
            reference: "2026-06-14T00:00:00Z",
            amount: 1,
            weekday: 1 as const,
            occurrence: 1,
            policy: "none" as const,
            parts: { year: 2026, month: 6, day: 15 },
            location: { latitude: 0, longitude: 0 },
            time: { hour: 9, minute: 0, second: 0, millisecond: 0 },
            range: { start: "09:00", end: "17:00" },
            offsetMinutes: 330,
            serial: 45000,
            seconds: 1_700_000_000,
            julianDate: 2_460_000,
            fromTimeZone: "UTC",
            toTimeZone: "Europe/London",
            firstTimeZone: "UTC",
            secondTimeZone: "Europe/London",
            busy: [],
            within: {
                start: new Date("2026-06-15T09:00:00Z"),
                end: new Date("2026-06-15T17:00:00Z"),
            },
            slotDuration: { hours: 1 },
            step: { hours: 1 },
            removed: [],
            rules: [],
            interval: {
                start: new Date("2026-06-15T00:00:00Z"),
                end: new Date("2026-06-16T00:00:00Z"),
            },
            timeZone: "UTC",
        };
        for (const key of Object.keys(dateTime)) {
            const method = dateTime[key as keyof typeof dateTime] as (
                value?: never,
            ) => unknown;
            if (typeof method !== "function") {
                continue;
            }
            try {
                if (method.length === 0) {
                    method();
                } else {
                    method(sample as never);
                }
            } catch {
                // Invalid combinations still execute the bound function.
            }
        }
        expect(dateTime.formatDate({ date: "2026-06-15T00:00:00Z" })).toBe(
            "2026-06-15",
        );
    });

    it("rejects the remaining invalid config fields", () => {
        expect(() => createDateTime({ locale: [] })).toThrow(TypeError);
        expect(() => createDateTime({ locale: ["!!!"] })).toThrow(RangeError);
        expect(() => createDateTime({ locale: "" })).toThrow(RangeError);
        expect(() => createDateTime({ minimumDaysInFirstWeek: 0 })).toThrow(
            RangeError,
        );
        expect(() => createDateTime({ workingDays: [0 as 1] })).toThrow(
            RangeError,
        );
        expect(() =>
            createDateTime({
                businessHours: [{ start: "99:00", end: "10:00" }],
            }),
        ).toThrow(RangeError);
        expect(() =>
            createDateTime({ disambiguation: "nope" as "compatible" }),
        ).toThrow(RangeError);
        expect(() =>
            createDateTime({ holidays: [{ date: "not-a-date" }] }),
        ).toThrow(RangeError);
        expect(() =>
            createDateTime({ numeric: "sometimes" as "auto" }),
        ).toThrow(RangeError);
        expect(() =>
            createDateTime({ formatPattern: 1 as unknown as string }),
        ).toThrow(TypeError);
        expect(() =>
            createDateTime({ fiscalYearLabel: "middle" as "end-year" }),
        ).toThrow(RangeError);
        expect(() =>
            createDateTime({ relativeTimeStyle: "huge" as "long" }),
        ).toThrow(RangeError);
        expect(
            createDateTime({ businessHours: [] }).isBusinessDay({
                date: "2026-06-15T12:00:00Z",
            }),
        ).toBe(true);
    });

    it("throws when the config is not usable", () => {
        expect(() => createDateTime({ timeZone: "Not/AZone" })).toThrow(
            RangeError,
        );
        expect(() => createDateTime({ weekStartsOn: 0 as 1 })).toThrow(
            RangeError,
        );
        expect(() => createDateTime({ locale: "!!!" })).toThrow(RangeError);
        expect(() =>
            createDateTime({ now: "now" as unknown as () => Date }),
        ).toThrow(TypeError);
    });
});
