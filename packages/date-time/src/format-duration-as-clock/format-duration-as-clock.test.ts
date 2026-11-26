import { describe, expect, it } from "vitest";
import { formatDurationAsClock } from "../index.js";

describe("formatDurationAsClock", () => {
    it("pads hours, minutes, and seconds", () => {
        expect(
            formatDurationAsClock({ hours: 1, minutes: 2, seconds: 3 }),
        ).toBe("01:02:03");
        expect(
            formatDurationAsClock(
                { hours: 1, minutes: 2, seconds: 3 },
                { alwaysShowHours: true, showMilliseconds: false },
            ),
        ).toBe("01:02:03");
        expect(formatDurationAsClock(0)).toBe("00:00:00");
        expect(
            formatDurationAsClock({ hours: 100, minutes: 1, seconds: 2 }),
        ).toBe("100:01:02");
    });

    it("hides a zero hour, shows milliseconds, and keeps a leading minus", () => {
        expect(
            formatDurationAsClock(
                { minutes: 1, seconds: 2, milliseconds: 3 },
                { alwaysShowHours: false, showMilliseconds: true },
            ),
        ).toBe("01:02.003");
        expect(formatDurationAsClock(-3_661_000)).toBe("-01:01:01");
        expect(formatDurationAsClock({ days: 1 })).toBe("24:00:00");
        expect(formatDurationAsClock({ weeks: 1 })).toBe("168:00:00");
    });

    it("rejects a string and a non-finite number", () => {
        expect(() => formatDurationAsClock("1" as never)).toThrow(TypeError);
        expect(() => formatDurationAsClock("1" as never)).toThrow(
            '`duration` must be a duration object; received "1".',
        );
        expect(() => formatDurationAsClock(Number.NaN)).toThrow(RangeError);
        expect(() => formatDurationAsClock(Number.POSITIVE_INFINITY)).toThrow(
            "`duration` must be a finite number; received Infinity.",
        );
    });
});
