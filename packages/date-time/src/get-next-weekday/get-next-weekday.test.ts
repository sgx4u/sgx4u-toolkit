import { describe, expect, it } from "vitest";
import { getNextWeekday } from "../index.js";

describe("getNextWeekday", () => {
    it("returns the start of the next weekday and can include today", () => {
        expect(
            getNextWeekday({
                date: "2026-11-26T15:00:00Z",
                weekday: 1,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-30T00:00:00.000Z");
        expect(
            getNextWeekday({
                date: "2026-11-26T15:00:00Z",
                weekday: 4,
                timeZone: "UTC",
                includeCurrentDay: true,
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
    });
});
