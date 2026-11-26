import { describe, expect, it } from "vitest";
import { getFiscalYear } from "../index.js";

const april = { fiscalYearStartMonth: 4, timeZone: "UTC" } as const;

describe("getFiscalYear", () => {
    it("labels 1 April 2026 through 31 March 2027 as fiscal year 2027", () => {
        expect(
            getFiscalYear({ date: "2026-03-31T00:00:00Z", ...april }),
        ).toBe(2026);
        expect(
            getFiscalYear({ date: "2026-04-01T00:00:00Z", ...april }),
        ).toBe(2027);
        expect(
            getFiscalYear({ date: "2026-12-31T00:00:00Z", ...april }),
        ).toBe(2027);
        expect(
            getFiscalYear({ date: "2027-01-01T00:00:00Z", ...april }),
        ).toBe(2027);
        expect(
            getFiscalYear({ date: "2027-03-31T00:00:00Z", ...april }),
        ).toBe(2027);
        expect(
            getFiscalYear({ date: "2027-04-01T00:00:00Z", ...april }),
        ).toBe(2028);
        expect(
            getFiscalYear({
                date: "2026-04-01T00:00:00Z",
                ...april,
                fiscalYearLabel: "start-year",
            }),
        ).toBe(2026);
        expect(
            getFiscalYear({
                date: "2026-06-15T00:00:00Z",
                fiscalYearStartMonth: 1,
                timeZone: "UTC",
            }),
        ).toBe(2026);
    });

    it("uses the wall-clock year at a daylight-saving and half-hour boundary", () => {
        expect(
            getFiscalYear({
                date: "2026-04-01T03:30:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "America/New_York",
            }),
        ).toBe(2026);
        expect(
            getFiscalYear({
                date: "2026-04-01T04:00:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "America/New_York",
            }),
        ).toBe(2027);
        expect(
            getFiscalYear({
                date: "2026-03-31T18:29:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(2026);
        expect(
            getFiscalYear({
                date: "2026-03-31T18:30:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(2027);
    });

    it("throws when the start month is missing or out of range", () => {
        expect(() =>
            getFiscalYear({ date: "2026-04-01T00:00:00Z" } as never),
        ).toThrow(TypeError);
        expect(() =>
            getFiscalYear({
                date: "2026-04-01T00:00:00Z",
                fiscalYearStartMonth: 0,
            }),
        ).toThrow(RangeError);
    });

    it("returns undefined when the date is not real", () => {
        expect(getFiscalYear({ date: "nope", ...april })).toBeUndefined();
    });
});