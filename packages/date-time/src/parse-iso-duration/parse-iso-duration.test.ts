import { describe, expect, it } from "vitest";
import { parseIsoDuration } from "../index.js";

describe("parseIsoDuration", () => {
    it("parses date, time, week, and negative durations", () => {
        expect(parseIsoDuration("PT1H30M")).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(parseIsoDuration("P1Y2M3DT4H5M6.5S")).toEqual({
            years: 1,
            months: 2,
            days: 3,
            hours: 4,
            minutes: 5,
            seconds: 6.5,
        });
        expect(parseIsoDuration("P1W")).toEqual({ weeks: 1 });
        expect(parseIsoDuration("-PT1H")).toEqual({ hours: -1 });
        expect(parseIsoDuration("-P1D")).toEqual({ days: -1 });
        expect(parseIsoDuration("PT1.5H")).toEqual({ hours: 1.5 });
        expect(parseIsoDuration("P1YT1.5H")).toEqual({
            years: 1,
            hours: 1.5,
        });
        expect(parseIsoDuration("PT0S")).toEqual({ seconds: 0 });
        expect(parseIsoDuration("P0D")).toEqual({ days: 0 });
    });

    it("returns undefined when the text is not an ISO duration", () => {
        const rejected = [
            "",
            "P",
            "PT",
            "-P",
            "-PT",
            "P1.5YT1H",
            "pt1h",
            " PT1H",
            "PT1H ",
            "1H",
            "P1H",
            "not a duration",
        ];

        for (const value of rejected) {
            expect(parseIsoDuration(value)).toBeUndefined();
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() => parseIsoDuration(undefined as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseIsoDuration(60 as unknown as string)).toThrow(
            "`value` must be a string; received 60.",
        );
    });
});
