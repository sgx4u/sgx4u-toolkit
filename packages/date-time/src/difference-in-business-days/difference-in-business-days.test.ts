import { describe, expect, it } from "vitest";
import { differenceInBusinessDays } from "../index.js";

describe("differenceInBusinessDays", () => {
    it("counts weekdays in a half-open range and skips the default weekend", () => {
        expect(
            differenceInBusinessDays(
                "2026-11-30T00:00:00Z",
                "2026-11-27T00:00:00Z",
                { timeZone: "UTC" },
            ),
        ).toBe(1);
        expect(
            differenceInBusinessDays(
                "2026-11-30T00:00:00Z",
                "2026-11-28T00:00:00Z",
                { timeZone: "UTC" },
            ),
        ).toBe(0);
        expect(
            differenceInBusinessDays(
                "2026-11-27T00:00:00Z",
                "2026-11-30T00:00:00Z",
                { timeZone: "UTC" },
            ),
        ).toBe(-1);
    });

    it("includes a Thursday leap day and the last weekday of the year", () => {
        expect(
            differenceInBusinessDays(
                "2024-03-01T00:00:00Z",
                "2024-02-28T00:00:00Z",
                { timeZone: "UTC" },
            ),
        ).toBe(2);
        expect(
            differenceInBusinessDays(
                "2025-01-01T00:00:00Z",
                "2024-12-31T00:00:00Z",
                { timeZone: "UTC" },
            ),
        ).toBe(1);
        expect(
            differenceInBusinessDays(
                "2025-01-02T00:00:00Z",
                "2024-12-31T00:00:00Z",
                { timeZone: "UTC", holidays: ["2024-12-31"] },
            ),
        ).toBe(1);
    });

    it("counts Eastern calendar days across the spring-forward weekend", () => {
        expect(
            differenceInBusinessDays(
                "2024-03-11T04:30:00Z",
                "2024-03-08T04:30:00Z",
                { timeZone: "America/New_York" },
            ),
        ).toBe(2);
    });

    it("rejects a calendar with no business day and a date that does not parse", () => {
        expect(() =>
            differenceInBusinessDays(
                "2031-01-01T00:00:00Z",
                "2020-01-01T00:00:00Z",
                {
                    timeZone: "UTC",
                    weekendDays: [1, 2, 3, 4, 5, 6, 7],
                },
            ),
        ).toThrow(RangeError);
        expect(() =>
            differenceInBusinessDays(
                "2031-01-01T00:00:00Z",
                "2020-01-01T00:00:00Z",
                {
                    timeZone: "UTC",
                    weekendDays: [1, 2, 3, 4, 5, 6, 7],
                },
            ),
        ).toThrow(
            "`calendar` must contain a business day; received 3660 consecutive non-business days.",
        );
        expect(() =>
            differenceInBusinessDays("nope", "2026-01-01T00:00:00Z", {
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
    });
});
