import { describe, expect, it } from "vitest";
import { getNextAnniversary } from "../index.js";

describe("getNextAnniversary", () => {
    it("returns the start of today when today is the anniversary", () => {
        expect(
            getNextAnniversary("2000-06-15", {
                now: "2026-06-15T18:00:00Z",
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-06-15T00:00:00.000Z");
        expect(
            getNextAnniversary("2000-06-15", {
                now: "2026-06-15T00:00:00Z",
                timeZone: "UTC",
                includeToday: false,
            }).toISOString(),
        ).toBe("2027-06-15T00:00:00.000Z");
        expect(
            getNextAnniversary("1999-12-31", {
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-12-31T00:00:00.000Z");
    });

    it("places a February 29 anniversary on March 1 or February 28", () => {
        expect(
            getNextAnniversary("2000-02-29", {
                now: "2021-02-28T12:00:00Z",
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2021-03-01T00:00:00.000Z");
        expect(
            getNextAnniversary("2000-02-29", {
                now: "2021-03-01T12:00:00Z",
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2021-03-01T00:00:00.000Z");
        expect(
            getNextAnniversary("2000-02-29", {
                now: "2021-02-28T12:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "february-28",
            }).toISOString(),
        ).toBe("2021-02-28T00:00:00.000Z");
        expect(
            getNextAnniversary("2000-02-29", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "february-28",
            }).toISOString(),
        ).toBe("2022-02-28T00:00:00.000Z");
    });

    it("uses local midnight through the New York spring-forward and Kolkata offset", () => {
        expect(
            getNextAnniversary("2000-03-08", {
                now: "2026-03-08T06:30:00Z",
                timeZone: "America/New_York",
            }).toISOString(),
        ).toBe("2026-03-08T05:00:00.000Z");
        expect(
            getNextAnniversary("2000-04-01", {
                now: "2026-03-31T18:29:00Z",
                timeZone: "Asia/Kolkata",
            }).toISOString(),
        ).toBe("2026-03-31T18:30:00.000Z");
        expect(
            getNextAnniversary("2000-04-01", {
                now: "2026-03-31T18:30:00Z",
                timeZone: "Asia/Kolkata",
            }).toISOString(),
        ).toBe("2026-03-31T18:30:00.000Z");
    });

    it("throws for a bad date or an unknown leap-day policy", () => {
        expect(() =>
            getNextAnniversary(null as never, { now: "2026-01-01T00:00:00Z" }),
        ).toThrow(TypeError);
        expect(() =>
            getNextAnniversary(null as never, { now: "2026-01-01T00:00:00Z" }),
        ).toThrow("`date` must be a Date");
        expect(() =>
            getNextAnniversary("2000-02-29", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "april" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getNextAnniversary("2000-02-29", {
                now: "2021-03-01T00:00:00Z",
                timeZone: "UTC",
                leapDayBirthdayInCommonYears: "april" as never,
            }),
        ).toThrow('"march-1" or "february-28"');
    });
});
