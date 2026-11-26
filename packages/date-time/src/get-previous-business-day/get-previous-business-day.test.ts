import { describe, expect, it } from "vitest";
import { getLocalTimeZone, getPreviousBusinessDay } from "../index.js";

const utc = { timeZone: "UTC" };

describe("getPreviousBusinessDay", () => {
    it("returns the start of the previous weekday", () => {
        expect(
            getPreviousBusinessDay("2026-11-30T15:00:00Z", utc).toISOString(),
        ).toBe("2026-11-27T00:00:00.000Z");
    });

    it("leaves the current business day and skips a holiday", () => {
        expect(
            getPreviousBusinessDay("2026-11-26T15:00:00Z", utc).toISOString(),
        ).toBe("2026-11-25T00:00:00.000Z");
        expect(
            getPreviousBusinessDay("2026-11-28T15:00:00Z", utc).toISOString(),
        ).toBe("2026-11-27T00:00:00.000Z");
        expect(
            getPreviousBusinessDay({ date: "2026-11-30T15:00:00Z", ...{
                timeZone: "UTC",
                holidays: ["2026-11-27"],
            } }).toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(() =>
            getPreviousBusinessDay({ date: "2026-11-26T00:00:00Z", ...{
                timeZone: "UTC",
                workingDays: [],
            } }),
        ).toThrow(RangeError);
        expect(() =>
            getPreviousBusinessDay({ date: "2026-11-26T00:00:00Z", ...{
                timeZone: "UTC",
                workingDays: [],
            } }),
        ).toThrow("`calendar`");
    });

    it("rejects a date that is not real", () => {
        expect(() => getPreviousBusinessDay("nope", utc)).toThrow(RangeError);
        expect(() => getPreviousBusinessDay("nope", utc)).toThrow("`date`");
        expect(() => getPreviousBusinessDay(null as never, utc)).toThrow(
            TypeError,
        );
        expect(() => getPreviousBusinessDay(null as never, utc)).toThrow(
            "`date`",
        );
    });

    it("uses the system zone and a Saturday-Sunday weekend", () => {
        const date = "2026-11-30T15:00:00Z";
        expect(getPreviousBusinessDay({ date: date }).toISOString()).toBe(
            getPreviousBusinessDay({ date: date, ...{
                timeZone: getLocalTimeZone(),
            } }).toISOString(),
        );
        expect(
            getPreviousBusinessDay({ date: date, ...{
                timeZone: "UTC",
                workingDays: [1, 2, 3, 4, 5],
            } }).toISOString(),
        ).toBe("2026-11-27T00:00:00.000Z");
    });

    it("starts the previous Friday at New York midnight", () => {
        expect(
            getPreviousBusinessDay({ date: "2024-03-11T15:00:00Z", ...{
                timeZone: "America/New_York",
            } }).toISOString(),
        ).toBe("2024-03-08T05:00:00.000Z");
        expect(
            getPreviousBusinessDay("2024-03-11T15:00:00Z", utc).toISOString(),
        ).toBe("2024-03-08T00:00:00.000Z");
    });
});
