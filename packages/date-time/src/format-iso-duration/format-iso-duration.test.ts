import { describe, expect, it } from "vitest";
import { formatISODuration } from "../index.js";

describe("formatISODuration", () => {
    it("writes clock fields and a zero duration", () => {
        expect(formatISODuration({ hours: 1, minutes: 30 })).toBe("PT1H30M");
        expect(formatISODuration({})).toBe("PT0S");
    });

    it("writes a negative day, a week, a year, and fractional seconds", () => {
        expect(formatISODuration({ days: -1, hours: -2 })).toBe("-P1DT2H");
        expect(formatISODuration({ weeks: 1 })).toBe("P1W");
        expect(formatISODuration({ years: 1, months: 2, days: 29 })).toBe(
            "P1Y2M29D",
        );
        expect(formatISODuration({ seconds: 1, milliseconds: 250 })).toBe(
            "PT1.25S",
        );
    });

    it("returns undefined for a mixed-sign duration and a value that is not a duration", () => {
        expect(formatISODuration({ hours: 1, minutes: -1 })).toBeUndefined();
        expect(formatISODuration(null as never)).toBeUndefined();
    });
});
