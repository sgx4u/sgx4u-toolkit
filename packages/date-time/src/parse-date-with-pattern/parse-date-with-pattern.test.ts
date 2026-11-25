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
        const text = formatDate(instant, pattern, { timeZone: "UTC" });
        expect(
            parseDateWithPattern(text, pattern, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe(instant.toISOString());
        expect(matchesDatePattern("2026-11-26", "yyyy-MM-dd")).toBe(true);
        expect(
            parseDateWithPattern("2026-02-30", "yyyy-MM-dd", {
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(() => parseDateWithPattern("2026", "QQQQQ")).toThrow(RangeError);
    });
});
