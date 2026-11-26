import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getQuarter } from "../index.js";

describe("getQuarter", () => {
    it("returns 4 for November", () => {
        expect(getQuarter("2026-11-26T00:00:00Z", { timeZone: "UTC" })).toBe(4);
    });

    it("changes quarter on the first instant of April, July, and October", () => {
        expect(getQuarter("2026-01-01T00:00:00Z", { timeZone: "UTC" })).toBe(1);
        expect(
            getQuarter("2026-03-31T23:59:59.999Z", { timeZone: "UTC" }),
        ).toBe(1);
        expect(
            getQuarter("2026-04-01T00:00:00.000Z", { timeZone: "UTC" }),
        ).toBe(2);
        expect(getQuarter("2026-06-30T00:00:00Z", { timeZone: "UTC" })).toBe(2);
        expect(getQuarter("2026-07-01T00:00:00Z", { timeZone: "UTC" })).toBe(3);
        expect(getQuarter("2026-09-30T00:00:00Z", { timeZone: "UTC" })).toBe(3);
        expect(getQuarter("2026-10-01T00:00:00Z", { timeZone: "UTC" })).toBe(4);
        expect(getQuarter("2026-12-31T00:00:00Z", { timeZone: "UTC" })).toBe(4);
    });

    it("rejects a date or zone that is not real", () => {
        expect(() => getQuarter("nope", { timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => getQuarter("nope", { timeZone: "UTC" })).toThrow("`date`");
        expect(() => getQuarter(null, { timeZone: "UTC" })).toThrow(TypeError);
        expect(() => getQuarter(null, { timeZone: "UTC" })).toThrow("`date`");
        expect(() =>
            getQuarter("2026-11-26T00:00:00Z", { timeZone: "Mars/Base" }),
        ).toThrow("`timeZone`");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-11-26T12:00:00Z";
        expect(getQuarter(date)).toBe(
            getQuarter(date, { timeZone: getLocalTimeZone() }),
        );
    });

    it("keeps 03:30 UTC on 1 April in the first quarter in New York", () => {
        expect(getQuarter("2026-04-01T03:30:00Z", { timeZone: "UTC" })).toBe(2);
        expect(
            getQuarter("2026-04-01T03:30:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(1);
        expect(
            getQuarter("2026-01-15T12:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(1);
        expect(
            getQuarter("2026-07-15T12:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(3);
    });
});
