import { describe, expect, it } from "vitest";
import {
    formatDate,
    matchesDatePattern,
    parseDateWithPattern,
} from "../index.js";

describe("parseDateWithPattern", () => {
    it("round-trips a padded numeric pattern and rejects an impossible day", () => {
        const pattern = "yyyy-MM-dd HH:mm:ss.SSS";
        const instant = new Date("2026-11-26T03:30:15.250Z");
        const text = formatDate({ date: instant, pattern, timeZone: "UTC" });
        expect(text).toBeDefined();
        expect(
            parseDateWithPattern({
                value: text!,
                pattern: pattern,
                ...{
                    timeZone: "UTC",
                },
            })?.toISOString(),
        ).toBe(instant.toISOString());
        expect(
            matchesDatePattern({ value: "2026-11-26", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            parseDateWithPattern({
                value: "2026-02-30",
                pattern: "yyyy-MM-dd",
                ...{
                    timeZone: "UTC",
                },
            }),
        ).toBeUndefined();
        expect(() =>
            parseDateWithPattern({ value: "2026", pattern: "QQQQQ" }),
        ).toThrow(RangeError);
        expect(
            parseDateWithPattern({
                value: "November 26, 2026",
                pattern: "MMMM d, yyyy",
                timeZone: "UTC",
                locale: "en-US",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            parseDateWithPattern({
                value: "Thursday",
                pattern: "EEEE",
                ...{
                    timeZone: "UTC",
                    locale: "en-US",
                    referenceDate: "2026-11-26T00:00:00Z",
                },
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            parseDateWithPattern({
                value: "3:30 PM",
                pattern: "h:mm a",
                ...{
                    timeZone: "UTC",
                    locale: "en-US",
                    referenceDate: "2026-11-26T00:00:00Z",
                },
            })?.toISOString(),
        ).toBe("2026-11-26T15:30:00.000Z");
    });
});
