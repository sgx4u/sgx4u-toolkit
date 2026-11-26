import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getTimeOfDay } from "../index.js";

describe("getTimeOfDay", () => {
    it("reads 03:30 in Asia/Kolkata", () => {
        expect(
            getTimeOfDay({ date: "2026-11-25T22:00:00.000Z", timeZone: "Asia/Kolkata", }),
        ).toEqual({ hour: 3, minute: 30, second: 0, millisecond: 0 });
    });

    it("reads midnight and a fractional second", () => {
        expect(
            getTimeOfDay({ date: "2026-11-26T00:00:00.000Z", timeZone: "UTC" }),
        ).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        expect(
            getTimeOfDay({ date: "2026-11-25T23:59:59.999Z", timeZone: "UTC" }),
        ).toEqual({ hour: 23, minute: 59, second: 59, millisecond: 999 });
        expect(
            getTimeOfDay({ date: "2026-11-26T00:00:00.250Z", timeZone: "UTC" }),
        ).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 250 });
    });

    it("rejects a date or zone that is not real", () => {
        expect(() => getTimeOfDay({ date: "nope", timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => getTimeOfDay({ date: "nope", timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() => getTimeOfDay({ date: null as never, timeZone: "UTC" })).toThrow(
            TypeError,
        );
        expect(() => getTimeOfDay({ date: null as never, timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() =>
            getTimeOfDay({ date: "2026-11-26T00:00:00Z", timeZone: "Mars/Base" }),
        ).toThrow("`timeZone`");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-26T12:00:00.000Z";
        expect(getTimeOfDay({ date: date })).toEqual(
            getTimeOfDay({ date: date, timeZone: getLocalTimeZone() }),
        );
    });

    it("places midnight on different UTC instants in standard and daylight time", () => {
        expect(
            getTimeOfDay({ date: "2026-01-15T05:00:00.000Z", timeZone: "America/New_York", }),
        ).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        expect(
            getTimeOfDay({ date: "2026-07-15T04:00:00.000Z", timeZone: "America/New_York", }),
        ).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        expect(
            getTimeOfDay({ date: "2026-11-26T00:00:00.000Z", timeZone: "America/New_York", }).hour,
        ).toBe(19);
    });
});
