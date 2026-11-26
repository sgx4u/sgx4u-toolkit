import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getWeekOfMonth } from "../index.js";

describe("getWeekOfMonth", () => {
    it("returns week 5 for 26 November 2026", () => {
        expect(
            getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" }),
        ).toBe(5);
    });

    it("starts every month at week 1 and can reach week 6", () => {
        expect(
            getWeekOfMonth({ date: "2026-02-01T00:00:00Z", timeZone: "UTC" }),
        ).toBe(1);
        expect(
            getWeekOfMonth({ date: "2026-02-02T00:00:00Z", timeZone: "UTC" }),
        ).toBe(2);
        expect(
            getWeekOfMonth({ date: "2026-03-31T00:00:00Z", timeZone: "UTC" }),
        ).toBe(6);
        expect(
            getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "UTC",
                weekStartsOn: 7, }),
        ).toBe(4);
    });

    it("rejects a date or a week start that is not real", () => {
        expect(() => getWeekOfMonth({ date: "nope", timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => getWeekOfMonth({ date: "nope", timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() =>
            getWeekOfMonth({ date: null as never, timeZone: "UTC" }),
        ).toThrow(TypeError);
        expect(() =>
            getWeekOfMonth({ date: null as never, timeZone: "UTC" }),
        ).toThrow("`date`");
        expect(() =>
            getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "UTC",
                weekStartsOn: 0 as never, }),
        ).toThrow("`weekStartsOn`");
        expect(() =>
            getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "Mars/Base" }),
        ).toThrow("`timeZone`");
    });

    it("starts the week on Monday", () => {
        const date = "2026-11-26T00:00:00Z";
        expect(getWeekOfMonth({ date: date, timeZone: "UTC" })).toBe(
            getWeekOfMonth({ date: date, timeZone: "UTC", weekStartsOn: 1 }),
        );
        expect(getWeekOfMonth({ date: date })).toBe(
            getWeekOfMonth({ date: date, timeZone: getLocalTimeZone() }),
        );
    });

    it("reads the New York calendar day before UTC midnight", () => {
        expect(
            getWeekOfMonth({ date: "2024-03-11T03:30:00Z", timeZone: "UTC" }),
        ).toBe(3);
        expect(
            getWeekOfMonth({ date: "2024-03-11T03:30:00Z", timeZone: "America/New_York", }),
        ).toBe(2);
    });
});
