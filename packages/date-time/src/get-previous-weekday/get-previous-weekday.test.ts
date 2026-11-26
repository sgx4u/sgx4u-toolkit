import { describe, expect, it } from "vitest";
import { getPreviousWeekday } from "../index.js";

describe("getPreviousWeekday", () => {
    it("returns the start of the previous weekday", () => {
        expect(
            getPreviousWeekday({
                date: "2026-11-26T15:00:00Z",
                weekday: 1,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-23T00:00:00.000Z");
    });
});
