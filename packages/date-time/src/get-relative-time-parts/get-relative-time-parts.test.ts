import { describe, expect, it } from "vitest";
import { getRelativeTimeParts } from "../index.js";

const now = "2026-01-01T00:00:00.000Z";

describe("getRelativeTimeParts", () => {
    it("describes three hours in the future", () => {
        expect(getRelativeTimeParts("2026-01-01T03:00:00Z", { now })).toEqual({
            value: 3,
            unit: "hour",
        });
    });

    it("switches unit at 45 seconds and 22 hours and never chooses weeks", () => {
        expect(getRelativeTimeParts(now, { now })).toEqual({
            value: 0,
            unit: "second",
        });
        expect(
            getRelativeTimeParts("2026-01-01T00:00:44.000Z", { now }),
        ).toEqual({ value: 44, unit: "second" });
        expect(
            getRelativeTimeParts("2026-01-01T00:00:45.000Z", { now }),
        ).toEqual({ value: 1, unit: "minute" });
        expect(
            getRelativeTimeParts("2026-01-01T21:59:59.000Z", { now }),
        ).toEqual({ value: 22, unit: "hour" });
        expect(
            getRelativeTimeParts("2026-01-01T22:00:00.000Z", { now }),
        ).toEqual({ value: 1, unit: "day" });
        expect(
            getRelativeTimeParts("2026-01-15T00:00:00.000Z", { now }),
        ).toEqual({ value: 14, unit: "day" });
        expect(
            getRelativeTimeParts("2025-12-31T21:00:00.000Z", { now }),
        ).toEqual({ value: -3, unit: "hour" });
        expect(
            getRelativeTimeParts("2026-01-15T00:00:00.000Z", {
                now,
                unit: "week",
            }),
        ).toEqual({ value: 2, unit: "week" });
    });

    it("rejects an unknown unit or a date that is not real", () => {
        expect(() =>
            getRelativeTimeParts("2026-01-01T00:00:00Z", {
                now,
                unit: "fortnight" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getRelativeTimeParts("2026-01-01T00:00:00Z", {
                now,
                unit: "fortnight" as never,
            }),
        ).toThrow("`unit`");
        expect(() => getRelativeTimeParts("nope", { now })).toThrow(RangeError);
        expect(() => getRelativeTimeParts("nope", { now })).toThrow("`date`");
        expect(() => getRelativeTimeParts(null as never, { now })).toThrow(
            TypeError,
        );
        expect(() => getRelativeTimeParts(null as never, { now })).toThrow(
            "`date`",
        );
        expect(() =>
            getRelativeTimeParts("2026-01-01T03:00:00Z", { now: "nope" }),
        ).toThrow("`now`");
    });

    it("defaults the unit to auto", () => {
        const date = "2026-01-01T03:00:00Z";
        expect(getRelativeTimeParts(date, { now })).toEqual(
            getRelativeTimeParts(date, { now, unit: "auto" }),
        );
    });
});
