import { describe, expect, it } from "vitest";
import { getLocalTimeZone, isBusinessDay } from "../index.js";

describe("isBusinessDay", () => {
    it("counts Thursday and not Saturday", () => {
        expect(isBusinessDay("2026-11-26T12:00:00Z", { timeZone: "UTC" })).toBe(
            true,
        );
        expect(isBusinessDay("2026-11-28T12:00:00Z", { timeZone: "UTC" })).toBe(
            false,
        );
    });

    it("counts Friday, skips Sunday, and honors a listed holiday", () => {
        expect(
            isBusinessDay("2026-11-27T00:00:00.000Z", { timeZone: "UTC" }),
        ).toBe(true);
        expect(
            isBusinessDay("2026-11-29T23:59:59.999Z", { timeZone: "UTC" }),
        ).toBe(false);
        expect(
            isBusinessDay("2026-11-26T00:00:00Z", {
                timeZone: "UTC",
                holidays: ["2026-11-26"],
            }),
        ).toBe(false);
        expect(
            isBusinessDay("2026-11-28T12:00:00Z", {
                timeZone: "UTC",
                weekendDays: [7],
            }),
        ).toBe(true);
    });

    it("rejects a date that is not real", () => {
        expect(() => isBusinessDay("nope", { timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => isBusinessDay("nope", { timeZone: "UTC" })).toThrow(
            "`date`",
        );
        expect(() => isBusinessDay(null as never, { timeZone: "UTC" })).toThrow(
            TypeError,
        );
        expect(() => isBusinessDay(null as never, { timeZone: "UTC" })).toThrow(
            "`date`",
        );
    });

    it("uses the system zone and a Saturday-Sunday weekend", () => {
        const date = "2026-11-26T12:00:00Z";
        expect(isBusinessDay(date)).toBe(
            isBusinessDay(date, { timeZone: getLocalTimeZone() }),
        );
        expect(
            isBusinessDay(date, { timeZone: "UTC", weekendDays: [6, 7] }),
        ).toBe(true);
    });

    it("keeps Saturday morning UTC on Friday evening in New York", () => {
        expect(isBusinessDay("2026-07-18T03:00:00Z", { timeZone: "UTC" })).toBe(
            false,
        );
        expect(
            isBusinessDay("2026-07-18T03:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isBusinessDay("2026-01-15T17:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isBusinessDay("2026-07-15T16:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(true);
    });
});
