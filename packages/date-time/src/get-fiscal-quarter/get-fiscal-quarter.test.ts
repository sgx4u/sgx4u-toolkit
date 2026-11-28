import { describe, expect, it } from "vitest";
import { getFiscalQuarter } from "../index.js";

const april = {
    date: "2026-04-01T00:00:00Z",
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
} as const;

describe("getFiscalQuarter", () => {
    it("starts quarter 1 on the fiscal start month", () => {
        expect(
            getFiscalQuarter({ ...april, date: "2026-04-01T00:00:00Z" }),
        ).toBe(1);
        expect(
            getFiscalQuarter({ ...april, date: "2026-06-30T00:00:00Z" }),
        ).toBe(1);
        expect(
            getFiscalQuarter({ ...april, date: "2026-07-01T00:00:00Z" }),
        ).toBe(2);
        expect(
            getFiscalQuarter({ ...april, date: "2026-12-31T00:00:00Z" }),
        ).toBe(3);
        expect(
            getFiscalQuarter({ ...april, date: "2027-01-01T00:00:00Z" }),
        ).toBe(4);
        expect(
            getFiscalQuarter({ ...april, date: "2027-03-31T00:00:00Z" }),
        ).toBe(4);
    });

    it("keeps the quarter of the wall-clock date at a zone boundary", () => {
        expect(
            getFiscalQuarter({
                date: "2026-04-01T03:30:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "America/New_York",
            }),
        ).toBe(4);
        expect(
            getFiscalQuarter({
                date: "2026-04-01T04:00:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "America/New_York",
            }),
        ).toBe(1);
        expect(
            getFiscalQuarter({
                date: "2026-03-31T18:29:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(4);
        expect(
            getFiscalQuarter({
                date: "2026-03-31T18:30:00Z",
                fiscalYearStartMonth: 4,
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(1);
    });

    it("throws when the start month or label is invalid", () => {
        expect(() =>
            getFiscalQuarter({
                date: "2026-04-01T00:00:00Z",
            } as never),
        ).toThrow(TypeError);
        expect(() =>
            getFiscalQuarter({
                date: "2026-04-01T00:00:00Z",
                fiscalYearStartMonth: 13,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getFiscalQuarter({
                date: "2026-04-01T00:00:00Z",
                fiscalYearStartMonth: 4,
                fiscalYearLabel: "middle" as never,
            }),
        ).toThrow(RangeError);
    });

    it("returns undefined when the date is not real", () => {
        expect(
            getFiscalQuarter({
                date: "nope",
                fiscalYearStartMonth: 4,
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
