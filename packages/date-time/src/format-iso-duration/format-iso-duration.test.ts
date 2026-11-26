import { describe, expect, it } from "vitest";
import { formatIsoDuration } from "../index.js";

describe("formatIsoDuration", () => {
    it("writes clock fields and a zero duration", () => {
        expect(formatIsoDuration({ hours: 1, minutes: 30 })).toBe("PT1H30M");
        expect(formatIsoDuration({})).toBe("PT0S");
    });

    it("writes a negative day, a week, a year, and fractional seconds", () => {
        expect(formatIsoDuration({ days: -1, hours: -2 })).toBe("-P1DT2H");
        expect(formatIsoDuration({ weeks: 1 })).toBe("P1W");
        expect(formatIsoDuration({ years: 1, months: 2, days: 29 })).toBe(
            "P1Y2M29D",
        );
        expect(formatIsoDuration({ seconds: 1, milliseconds: 250 })).toBe(
            "PT1.25S",
        );
    });

    it("rejects a mixed-sign duration and a value that is not a duration", () => {
        expect(() => formatIsoDuration({ hours: 1, minutes: -1 })).toThrow(
            RangeError,
        );
        expect(() => formatIsoDuration({ hours: 1, minutes: -1 })).toThrow(
            "`duration` must be a duration whose fields share one sign; received [object Object].",
        );
        expect(() => formatIsoDuration(null as never)).toThrow(TypeError);
        expect(() => formatIsoDuration(null as never)).toThrow(
            "`duration` must be a duration object; received null.",
        );
    });
});
