import { describe, expect, it } from "vitest";
import { getNthWeekdayOfMonth } from "../index.js";

describe("getNthWeekdayOfMonth", () => {
    it("returns undefined when the occurrence does not exist", () => {
        expect(
            getNthWeekdayOfMonth({
                year: 2026,
                month: 11,
                weekday: 4,
                occurrence: 4,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            getNthWeekdayOfMonth({
                year: 2026,
                month: 11,
                weekday: 4,
                occurrence: -1,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            getNthWeekdayOfMonth({
                year: 2026,
                month: 2,
                weekday: 1,
                occurrence: 5,
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(() =>
            getNthWeekdayOfMonth({
                year: 2026,
                month: 11,
                weekday: 1,
                occurrence: 6,
            }),
        ).toThrow(RangeError);
    });
});
