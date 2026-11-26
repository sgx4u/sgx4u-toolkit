import { describe, expect, it } from "vitest";
import { getUTCOffset } from "../index.js";

describe("getUTCOffset", () => {
    it("returns whole-minute offsets for modern zones", () => {
        expect(
            getUTCOffset({
                date: "2024-06-15T12:00:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(330);
        expect(
            getUTCOffset({ date: "2024-06-15T12:00:00Z", timeZone: "UTC" }),
        ).toBe(0);
        expect(
            getUTCOffset({
                date: "2024-01-15T12:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(-300);
        expect(
            getUTCOffset({
                date: "2024-07-15T12:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toBe(-240);
        expect(
            getUTCOffset({
                date: "2024-06-15T00:00:00Z",
                timeZone: "+05:30",
            }),
        ).toBe(330);
    });

    it("keeps a fractional historical offset", () => {
        expect(
            getUTCOffset({
                date: "1904-06-01T17:32:11.000Z",
                timeZone: "America/Detroit",
            }),
        ).toBeCloseTo(-332.1833333333, 6);
        expect(
            getUTCOffset({
                date: "1900-01-01T00:00:00.000Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBeCloseTo(321.1666666667, 6);
    });

    it("does not change the input date", () => {
        const date = new Date("2024-06-15T12:00:00.000Z");
        const timeValue = date.getTime();

        getUTCOffset({ date, timeZone: "UTC" });

        expect(date.getTime()).toBe(timeValue);
    });

    it("returns undefined for a bad date and throws for a bad zone", () => {
        expect(
            getUTCOffset({ date: "nope", timeZone: "UTC" }),
        ).toBeUndefined();
        expect(() =>
            getUTCOffset({
                date: "2024-06-15T00:00:00Z",
                timeZone: "Mars/Base",
            }),
        ).toThrow(
            '`timeZone` must be an IANA time zone or ±HH:mm offset; received "Mars/Base".',
        );
        expect(() =>
            getUTCOffset({
                date: "2024-06-15T00:00:00Z",
                timeZone: 5 as unknown as string,
            }),
        ).toThrow(TypeError);
    });
});