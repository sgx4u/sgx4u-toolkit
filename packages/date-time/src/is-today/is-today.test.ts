import { describe, expect, it } from "vitest";
import { getLocalTimeZone, isToday } from "../index.js";

const now = "2026-11-26T12:00:00.000Z";

describe("isToday", () => {
    it("matches another time on the same UTC day", () => {
        expect(isToday({ date: "2026-11-26T01:00:00Z", now, timeZone: "UTC" })).toBe(
            true,
        );
        expect(isToday({ date: "2026-11-27T00:00:00Z", now, timeZone: "UTC" })).toBe(
            false,
        );
    });

    it("includes the last millisecond of the day and excludes the next midnight", () => {
        expect(
            isToday({ date: "2026-11-26T00:00:00.000Z", now, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isToday({ date: "2026-11-26T23:59:59.999Z", now, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isToday({ date: "2026-11-27T00:00:00.000Z", now, timeZone: "UTC" }),
        ).toBe(false);
        expect(
            isToday({ date: "2026-11-25T23:59:59.999Z", now, timeZone: "UTC" }),
        ).toBe(false);
    });

    it("rejects a date that is not real", () => {
        expect(() => isToday({ date: "nope", now, timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => isToday({ date: "nope", now, timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() => isToday({ date: null as never, now, timeZone: "UTC" })).toThrow(
            TypeError,
        );
        expect(() => isToday({ date: null as never, now, timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() =>
            isToday({ date: "2026-11-26T00:00:00Z", now: "nope", timeZone: "UTC" }),
        ).toThrow("`now`");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-26T12:00:00Z";
        expect(isToday({ date: date, now })).toBe(
            isToday({ date: date, now, timeZone: getLocalTimeZone() }),
        );
    });

    it("splits the UTC day across midnight in New York", () => {
        const evening = "2026-11-26T04:30:00Z";
        expect(
            isToday({ date: "2026-11-26T05:30:00Z", now: evening, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isToday({ date: "2026-11-26T05:30:00Z", now: evening,
                timeZone: "America/New_York", }),
        ).toBe(false);
        expect(
            isToday({ date: "2026-01-15T17:00:00Z", now: "2026-01-15T12:00:00Z",
                timeZone: "America/New_York", }),
        ).toBe(true);
        expect(
            isToday({ date: "2026-07-15T03:30:00Z", now: "2026-07-15T16:00:00Z",
                timeZone: "America/New_York", }),
        ).toBe(false);
    });
});
