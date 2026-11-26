import { describe, expect, it } from "vitest";
import { getIsoWeekYear } from "../index.js";

describe("getIsoWeekYear", () => {
    it("assigns 2026-01-01 to 2026 and 2021-01-01 to 2020", () => {
        expect(
            getIsoWeekYear("2026-01-01T00:00:00Z", { timeZone: "UTC" }),
        ).toBe(2026);
        expect(
            getIsoWeekYear("2025-12-29T00:00:00Z", { timeZone: "UTC" }),
        ).toBe(2026);
        expect(
            getIsoWeekYear("2021-01-01T00:00:00Z", { timeZone: "UTC" }),
        ).toBe(2020);
        expect(
            getIsoWeekYear("2020-12-31T00:00:00Z", { timeZone: "UTC" }),
        ).toBe(2020);
    });

    it("moves the week-year at local midnight", () => {
        expect(
            getIsoWeekYear("2024-12-30T04:59:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(2024);
        expect(
            getIsoWeekYear("2024-12-30T05:00:00Z", {
                timeZone: "America/New_York",
            }),
        ).toBe(2025);
        expect(
            getIsoWeekYear("2024-12-29T18:29:00Z", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(2024);
        expect(
            getIsoWeekYear("2024-12-29T18:30:00Z", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(2025);
    });

    it("reads a date-only string in the default zone", () => {
        expect(getIsoWeekYear("2021-01-01")).toBe(2020);
    });

    it("throws when the date is not real", () => {
        expect(() => getIsoWeekYear(null as never)).toThrow(TypeError);
        expect(() => getIsoWeekYear(null as never)).toThrow(
            "`date` must be a Date",
        );
        expect(() => getIsoWeekYear("nope", { timeZone: "UTC" })).toThrow(
            RangeError,
        );
        expect(() => getIsoWeekYear("nope", { timeZone: "UTC" })).toThrow(
            "valid date",
        );
    });
});
