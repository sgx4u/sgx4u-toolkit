import { describe, expect, it } from "vitest";
import { formatDateRange } from "../index.js";

const dash = "\u2009\u2013\u2009";

describe("formatDateRange", () => {
    it("collapses a medium range in the same month", () => {
        const options = { timeZone: "UTC", locale: "en-US" };
        expect(
            formatDateRange({
                start: "2026-01-03T00:00:00Z",
                end: "2026-01-05T00:00:00Z",
                options,
            }),
        ).toBe(`Jan 3${dash}5, 2026`);
        expect(
            formatDateRange({
                start: "2026-01-03T00:00:00Z",
                end: "2026-01-05T00:00:00Z",
                ...options,
                dateStyle: "medium",
            }),
        ).toBe(`Jan 3${dash}5, 2026`);
    });

    it("keeps both months for a leap day and both years at New Year", () => {
        expect(
            formatDateRange({
                start: "2024-02-29T00:00:00Z",
                end: "2024-03-01T00:00:00Z",
                timeZone: "UTC",
                locale: "en-US",
            }),
        ).toBe(`Feb 29${dash}Mar 1, 2024`);
        expect(
            formatDateRange({
                start: "2024-12-31T00:00:00Z",
                end: "2025-01-01T00:00:00Z",
                timeZone: "UTC",
                locale: "en-US",
            }),
        ).toBe(`Dec 31, 2024${dash}Jan 1, 2025`);
    });

    it("formats the Eastern calendar days on either side of the spring-forward", () => {
        expect(
            formatDateRange({
                start: "2024-03-10T05:00:00Z",
                end: "2024-03-11T04:00:00Z",
                timeZone: "America/New_York",
                locale: "en-US",
            }),
        ).toBe(`Mar 10${dash}11, 2024`);
    });

    it("rejects a start that is after the end", () => {
        expect(() =>
            formatDateRange({
                start: "2026-01-05T00:00:00Z",
                end: "2026-01-03T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(() =>
            formatDateRange({
                start: "2026-01-05T00:00:00Z",
                end: "2026-01-03T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toThrow(
            '`start` must be a date at or before `end`; received "2026-01-05T00:00:00Z".',
        );
        expect(() =>
            formatDateRange({
                start: "nope",
                end: "2026-01-03T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
    });
});
