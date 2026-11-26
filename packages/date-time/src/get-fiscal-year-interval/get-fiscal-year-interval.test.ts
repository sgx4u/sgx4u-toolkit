import { describe, expect, it } from "vitest";
import { getFiscalYearInterval } from "../index.js";

describe("getFiscalYearInterval", () => {
    it("returns the half-open span labeled by the end year", () => {
        const interval = getFiscalYearInterval(2027, {
            fiscalYearStartMonth: 4,
            timeZone: "UTC",
        });
        expect(interval.start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
        expect(interval.end.toISOString()).toBe("2027-04-01T00:00:00.000Z");
        const startYear = getFiscalYearInterval(2026, {
            fiscalYearStartMonth: 4,
            fiscalYearLabel: "start-year",
            timeZone: "UTC",
        });
        expect(startYear.start.toISOString()).toBe("2026-04-01T00:00:00.000Z");
        expect(startYear.end.toISOString()).toBe("2027-04-01T00:00:00.000Z");
        const calendar = getFiscalYearInterval(2026, {
            fiscalYearStartMonth: 1,
            timeZone: "UTC",
        });
        expect(calendar.start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
        expect(calendar.end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
    });

    it("places midnight in America/New_York and Asia/Kolkata", () => {
        const newYork = getFiscalYearInterval(2027, {
            fiscalYearStartMonth: 4,
            timeZone: "America/New_York",
        });
        expect(newYork.start.toISOString()).toBe("2026-04-01T04:00:00.000Z");
        expect(newYork.end.toISOString()).toBe("2027-04-01T04:00:00.000Z");
        const kolkata = getFiscalYearInterval(2027, {
            fiscalYearStartMonth: 4,
            timeZone: "Asia/Kolkata",
        });
        expect(kolkata.start.toISOString()).toBe("2026-03-31T18:30:00.000Z");
        expect(kolkata.end.toISOString()).toBe("2027-03-31T18:30:00.000Z");
    });

    it("throws when the year or the start month is invalid", () => {
        expect(() => getFiscalYearInterval(2027, {} as never)).toThrow(
            TypeError,
        );
        expect(() => getFiscalYearInterval(2027, {} as never)).toThrow(
            "`fiscalYearStartMonth` must be a month from 1 to 12",
        );
        expect(() =>
            getFiscalYearInterval(2027.5, { fiscalYearStartMonth: 4 }),
        ).toThrow(RangeError);
        expect(() =>
            getFiscalYearInterval(2027.5, { fiscalYearStartMonth: 4 }),
        ).toThrow("`fiscalYear` must be an integer");
        expect(() =>
            getFiscalYearInterval(2027, { fiscalYearStartMonth: 13 }),
        ).toThrow(RangeError);
        expect(() =>
            getFiscalYearInterval(2027, { fiscalYearStartMonth: 13 }),
        ).toThrow("an integer from 1 to 12");
    });
});
