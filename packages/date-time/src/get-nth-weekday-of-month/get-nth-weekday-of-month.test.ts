import { describe, expect, it } from "vitest";
import { getNthWeekdayOfMonth } from "../index.js";

describe("getNthWeekdayOfMonth", () => {
    it("returns undefined when the occurrence does not exist", () => {
        expect(
            getNthWeekdayOfMonth(2026, 11, 4, 4, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            getNthWeekdayOfMonth(2026, 11, 4, -1, {
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            getNthWeekdayOfMonth(2026, 2, 1, 5, { timeZone: "UTC" }),
        ).toBeUndefined();
        expect(() => getNthWeekdayOfMonth(2026, 11, 1, 6)).toThrow(RangeError);
    });
});
