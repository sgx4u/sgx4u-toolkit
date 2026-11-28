import { describe, expect, it } from "vitest";
import { formatISODateTime } from "../index.js";

describe("formatISODateTime", () => {
    it("writes milliseconds and uses Z only for UTC", () => {
        expect(
            formatISODateTime({
                date: "2024-02-29T00:00:00.000Z",
                timeZone: "UTC",
            }),
        ).toBe("2024-02-29T00:00:00.000Z");
        expect(
            formatISODateTime({
                date: "2024-02-29T00:00:00.000Z",
                timeZone: "UTC",
                precision: "millisecond",
                includeTimeZoneName: false,
            }),
        ).toBe("2024-02-29T00:00:00.000Z");
        expect(
            formatISODateTime({
                date: "2026-11-25T22:00:00.000Z",
                timeZone: "UTC",
                includeTimeZoneName: true,
            }),
        ).toBe("2026-11-25T22:00:00.000Z[UTC]");
    });

    it("writes the India offset for leap-day midnight and the next year", () => {
        expect(
            formatISODateTime({
                date: "2024-02-28T18:30:00.000Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("2024-02-29T00:00:00.000+05:30");
        expect(
            formatISODateTime({
                date: "2024-12-31T22:00:00.000Z",
                timeZone: "Asia/Kolkata",
                precision: "minute",
            }),
        ).toBe("2025-01-01T03:30+05:30");
        expect(
            formatISODateTime({
                date: "2026-11-25T22:00:00.000Z",
                timeZone: "Asia/Kolkata",
                precision: "second",
            }),
        ).toBe("2026-11-26T03:30:00+05:30");
    });

    it("shows the spring-forward jump and both fall-back offsets", () => {
        expect(
            formatISODateTime({
                date: "2024-03-10T06:30:00.000Z",
                timeZone: "America/New_York",
                precision: "minute",
            }),
        ).toBe("2024-03-10T01:30-05:00");
        expect(
            formatISODateTime({
                date: "2024-03-10T07:30:00.000Z",
                timeZone: "America/New_York",
                precision: "minute",
                includeTimeZoneName: true,
            }),
        ).toBe("2024-03-10T03:30-04:00[America/New_York]");
        expect(
            formatISODateTime({
                date: "2024-11-03T05:30:00.000Z",
                timeZone: "America/New_York",
            }),
        ).toBe("2024-11-03T01:30:00.000-04:00");
        expect(
            formatISODateTime({
                date: "2024-11-03T06:30:00.000Z",
                timeZone: "America/New_York",
            }),
        ).toBe("2024-11-03T01:30:00.000-05:00");
    });

    it("rejects an unknown precision and a date that does not parse", () => {
        expect(() =>
            formatISODateTime({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                precision: "hour" as "minute",
            }),
        ).toThrow(RangeError);
        expect(() =>
            formatISODateTime({
                date: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                precision: "hour" as "minute",
            }),
        ).toThrow(
            '`precision` must be "minute", "second", or "millisecond"; received "hour".',
        );
        expect(
            formatISODateTime({ date: "nope", timeZone: "UTC" }),
        ).toBeUndefined();
    });
});
