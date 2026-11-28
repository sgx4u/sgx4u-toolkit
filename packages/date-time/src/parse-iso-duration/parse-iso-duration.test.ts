import { describe, expect, it } from "vitest";
import { parseISODuration } from "../index.js";

describe("parseISODuration", () => {
    it("parses date, time, week, and negative durations", () => {
        expect(parseISODuration("PT1H30M")).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(parseISODuration("P1Y2M3DT4H5M6.5S")).toEqual({
            years: 1,
            months: 2,
            days: 3,
            hours: 4,
            minutes: 5,
            seconds: 6.5,
        });
        expect(parseISODuration("P1W")).toEqual({ weeks: 1 });
        expect(parseISODuration("-PT1H")).toEqual({ hours: -1 });
        expect(parseISODuration("-P1D")).toEqual({ days: -1 });
        expect(parseISODuration("PT1.5H")).toEqual({ hours: 1.5 });
        expect(parseISODuration("P1YT1.5H")).toEqual({
            years: 1,
            hours: 1.5,
        });
        expect(parseISODuration("PT0S")).toEqual({ seconds: 0 });
        expect(parseISODuration("P0D")).toEqual({ days: 0 });
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
            expect(parseISODuration(value)).toBeUndefined();
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() => parseISODuration(undefined as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseISODuration(60 as unknown as string)).toThrow(
            "`value` must be a string; received 60.",
        );
    });
});
