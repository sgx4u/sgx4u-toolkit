import { describe, expect, it } from "vitest";
import { getLocalTimeZone, isDaylightSavingTime } from "../index.js";

describe("isDaylightSavingTime", () => {
    it("is false on 15 January and true on 15 July in New York", () => {
        expect(
            isDaylightSavingTime({
                date: "2026-01-15T17:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isDaylightSavingTime({
                date: "2026-07-15T16:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(true);
    });

    it("changes at the spring-forward instant and stays false where the offset does not", () => {
        expect(
            isDaylightSavingTime({
                date: "2024-03-10T06:59:59.000Z",
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isDaylightSavingTime({
                date: "2024-03-10T07:00:00.000Z",
                timeZone: "America/New_York",
            }),
        ).toBe(true);
        expect(
            isDaylightSavingTime({
                date: "2026-07-15T12:00:00Z",
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            isDaylightSavingTime({
                date: "2026-07-15T12:00:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(false);
    });

    it("rejects a date or zone that is not real", () => {
        expect(
            isDaylightSavingTime({
                date: "nope",
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(
            isDaylightSavingTime({
                date: null as never,
                timeZone: "America/New_York",
            }),
        ).toBe(false);
        expect(() =>
            isDaylightSavingTime({
                date: "2026-07-15T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow("`timeZone`");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const date = "2026-07-15T16:00:00Z";
        expect(isDaylightSavingTime({ date: date })).toBe(
            isDaylightSavingTime({ date: date, timeZone: getLocalTimeZone() }),
        );
    });
});
