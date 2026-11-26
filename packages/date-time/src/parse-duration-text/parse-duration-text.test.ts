import { describe, expect, it } from "vitest";
import {
    formatDuration,
    formatDurationAsClock,
    formatDurationCompact,
    formatISODuration,
    isValidDuration,
    parseDurationText,
    parseISODuration,
} from "../index.js";

describe("duration text", () => {
    it("parses English text and ISO durations and writes them back", () => {
        expect(parseDurationText("1h 30m")).toEqual({ hours: 1, minutes: 30 });
        expect(parseDurationText("-1.5 hours")).toEqual({ hours: -1.5 });
        expect(parseDurationText("1:30:00")).toEqual({
            hours: 1,
            minutes: 30,
            seconds: 0,
        });
        expect(parseDurationText("nope")).toBeUndefined();
        expect(parseISODuration("PT1H30M")).toEqual({ hours: 1, minutes: 30 });
        expect(parseISODuration("P")).toBeUndefined();
        expect(formatISODuration({ hours: 1, minutes: 30 })).toBe("PT1H30M");
        expect(
            parseISODuration(formatISODuration({ hours: 1, minutes: 30 })!),
        ).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(isValidDuration({ hours: 1, minutes: 30 })).toBe(true);
        expect(isValidDuration({})).toBe(true);
        expect(isValidDuration({ hours: 1, days: -1 })).toBe(false);
        expect(
            formatDurationAsClock({
                duration: { hours: 1, minutes: 2, seconds: 3 },
            }),
        ).toBe("01:02:03");
        expect(
            formatDurationCompact({ duration: { hours: 1, minutes: 30 } }),
        ).toBe("1h 30m");
        expect(formatDurationCompact({ duration: 0 })).toBe("0s");
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 30 },
                locale: "en",
            }),
        ).toBe("1 hour, 30 minutes");
    });
});
