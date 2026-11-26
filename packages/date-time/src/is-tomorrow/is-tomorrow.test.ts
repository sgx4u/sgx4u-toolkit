import { describe, expect, it } from "vitest";
import { getLocalTimeZone, isTomorrow } from "../index.js";

const now = "2026-11-26T12:00:00.000Z";

describe("isTomorrow", () => {
    it("matches the following UTC day", () => {
        expect(
            isTomorrow("2026-11-27T00:00:00Z", { now, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isTomorrow("2026-11-26T23:00:00Z", { now, timeZone: "UTC" }),
        ).toBe(false);
    });

    it("includes the whole next day and excludes the day after", () => {
        expect(
            isTomorrow("2026-11-27T00:00:00.000Z", { now, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isTomorrow("2026-11-27T23:59:59.999Z", { now, timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isTomorrow("2026-11-28T00:00:00.000Z", { now, timeZone: "UTC" }),
        ).toBe(false);
        expect(isTomorrow(now, { now, timeZone: "UTC" })).toBe(false);
    });

    it("rejects a date that is not real", () => {
        expect(() => isTomorrow("nope", { now, timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => isTomorrow("nope", { now, timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() => isTomorrow(null, { now, timeZone: "UTC" })).toThrow(
            TypeError,
        );
        expect(() => isTomorrow(null, { now, timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() =>
            isTomorrow("2026-11-27T00:00:00Z", {
                now: "nope",
                timeZone: "UTC",
            }),
        ).toThrow("`now`");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-27T12:00:00Z";
        expect(isTomorrow(date, { now })).toBe(
            isTomorrow(date, { now, timeZone: getLocalTimeZone() }),
        );
    });

    it("calls the next New York calendar day tomorrow while UTC still calls it today", () => {
        const evening = "2026-11-26T04:30:00Z";
        expect(
            isTomorrow("2026-11-26T15:00:00Z", {
                now: evening,
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isTomorrow("2026-11-26T15:00:00Z", {
                now: evening,
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isTomorrow("2026-07-16T04:30:00Z", {
                now: "2026-07-15T16:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(true);
    });
});
