import { describe, expect, it } from "vitest";
import {
    formatRelativeCalendarDay,
    formatRelativeTime,
    getRelativeTimeParts,
} from "../index.js";

describe("relative time", () => {
    it("picks a unit and formats it", () => {
        expect(
            getRelativeTimeParts({
                date: "2026-01-01T03:00:00Z",
                now: "2026-01-01T00:00:00Z",
            }),
        ).toEqual({ value: 3, unit: "hour" });
        expect(
            formatRelativeTime({
                date: "2026-01-04T00:00:00Z",
                now: "2026-01-01T00:00:00Z",
                locale: "en",
            }),
        ).toBe("in 3 days");
        const yesterday = formatRelativeCalendarDay({
            date: "2026-01-01T17:00:00Z",
            now: "2026-01-02T12:00:00Z",
            timeZone: "UTC",
            locale: "en",
        });
        expect(yesterday?.startsWith("Yesterday at ")).toBe(true);
    });
});
