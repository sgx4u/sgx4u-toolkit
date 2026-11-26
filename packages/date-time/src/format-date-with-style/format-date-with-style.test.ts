import { describe, expect, it } from "vitest";
import { formatDateWithStyle } from "../index.js";

describe("formatDateWithStyle", () => {
    it("uses a medium date when no style is set", () => {
        expect(
            formatDateWithStyle("2026-11-26T00:00:00Z", {
                timeZone: "UTC",
                locale: "en-US",
            }),
        ).toBe("Nov 26, 2026");
        expect(
            formatDateWithStyle("2024-02-29T00:00:00Z", {
                timeZone: "UTC",
                locale: "en-US",
                dateStyle: "medium",
            }),
        ).toBe("Feb 29, 2024");
    });

    it("formats the India new year and omits the date when only a time style is set", () => {
        expect(
            formatDateWithStyle("2024-12-31T22:00:00Z", {
                timeZone: "Asia/Kolkata",
                locale: "en-US",
            }),
        ).toBe("Jan 1, 2025");
        expect(
            formatDateWithStyle("2024-03-10T06:30:00Z", {
                timeZone: "America/New_York",
                locale: "en-US",
                timeStyle: "short",
            }),
        ).toBe("1:30 AM");
    });

    it("shows the skipped spring-forward hour and both names of the fall-back hour", () => {
        const zone = {
            timeZone: "America/New_York",
            locale: "en-US",
            timeStyle: "short" as const,
        };
        expect(formatDateWithStyle("2024-03-10T06:30:00.000Z", zone)).toBe(
            "1:30 AM",
        );
        expect(formatDateWithStyle("2024-03-10T07:30:00.000Z", zone)).toBe(
            "3:30 AM",
        );
        const named = {
            timeZone: "America/New_York",
            locale: "en-US",
            dateStyle: "short" as const,
            timeStyle: "long" as const,
        };
        expect(formatDateWithStyle("2024-11-03T05:30:00.000Z", named)).toBe(
            "11/3/24, 1:30:00 AM EDT",
        );
        expect(formatDateWithStyle("2024-11-03T06:30:00.000Z", named)).toBe(
            "11/3/24, 1:30:00 AM EST",
        );
    });

    it("rejects a date that does not parse", () => {
        expect(() =>
            formatDateWithStyle("nope", { timeZone: "UTC", locale: "en-US" }),
        ).toThrow(RangeError);
        expect(() =>
            formatDateWithStyle("nope", { timeZone: "UTC", locale: "en-US" }),
        ).toThrow('`date` must be a valid date; received "nope".');
    });
});
