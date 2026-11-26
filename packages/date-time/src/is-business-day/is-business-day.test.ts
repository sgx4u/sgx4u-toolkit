import { describe, expect, it } from "vitest";
import { getLocalTimeZone, isBusinessDay } from "../index.js";

describe("isBusinessDay", () => {
    it("counts Thursday and not Saturday", () => {
        expect(isBusinessDay({ date: "2026-11-26T12:00:00Z", ...{ timeZone: "UTC" } })).toBe(
            true,
        );
        expect(isBusinessDay({ date: "2026-11-28T12:00:00Z", ...{ timeZone: "UTC" } })).toBe(
            false,
        );
    });

    it("counts Friday, skips Sunday, and honors a listed holiday", () => {
        expect(
            isBusinessDay({ date: "2026-11-27T00:00:00.000Z", ...{ timeZone: "UTC" } }),
        ).toBe(true);
        expect(
            isBusinessDay({ date: "2026-11-29T23:59:59.999Z", ...{ timeZone: "UTC" } }),
        ).toBe(false);
        expect(
            isBusinessDay({ date: "2026-11-26T00:00:00Z", ...{
                timeZone: "UTC",
                holidays: ["2026-11-26"],
            } }),
        ).toBe(false);
        expect(
            isBusinessDay({ date: "2026-11-28T12:00:00Z", ...{
                timeZone: "UTC",
                workingDays: [1, 2, 3, 4, 5, 6],
            } }),
        ).toBe(true);
    });

    it("rejects a date that is not real", () => {
        expect(() => isBusinessDay({ date: "nope", ...{ timeZone: "UTC" } })).toThrow(
            RangeError,
        );
        expect(() => isBusinessDay({ date: "nope", ...{ timeZone: "UTC" } })).toThrow(
            "`date`",
        );
        expect(() => isBusinessDay({ date: null as never, ...{ timeZone: "UTC" } })).toThrow(
            TypeError,
        );
        expect(() => isBusinessDay({ date: null as never, ...{ timeZone: "UTC" } })).toThrow(
            "`date`",
        );
    });

    it("uses the system zone and a Saturday-Sunday weekend", () => {
        const date = "2026-11-26T12:00:00Z";
        expect(isBusinessDay({ date: date })).toBe(
            isBusinessDay({ date: date, ...{ timeZone: getLocalTimeZone() } }),
        );
        expect(
            isBusinessDay({ date: date, ...{ timeZone: "UTC", workingDays: [1, 2, 3, 4, 5] } }),
        ).toBe(true);
    });

    it("keeps Saturday morning UTC on Friday evening in New York", () => {
        expect(isBusinessDay({ date: "2026-07-18T03:00:00Z", ...{ timeZone: "UTC" } })).toBe(
            false,
        );
        expect(
            isBusinessDay({ date: "2026-07-18T03:00:00Z", ...{
                timeZone: "America/New_York",
            } }),
        ).toBe(true);
        expect(
            isBusinessDay({ date: "2026-01-15T17:00:00Z", ...{
                timeZone: "America/New_York",
            } }),
        ).toBe(true);
        expect(
            isBusinessDay({ date: "2026-07-15T16:00:00Z", ...{
                timeZone: "America/New_York",
            } }),
        ).toBe(true);
    });
});
