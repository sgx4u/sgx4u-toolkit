import { describe, expect, it } from "vitest";
import { getDateParts, parseIsoDate } from "../index.js";

describe("parseIsoDate", () => {
    it("reads midnight in the requested zone", () => {
        expect(
            parseIsoDate("2026-11-26", { timeZone: "UTC" })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            parseIsoDate("2026-11-26", {
                timeZone: "Asia/Kolkata",
            })?.toISOString(),
        ).toBe("2026-11-25T18:30:00.000Z");
        expect(
            parseIsoDate("2024-01-15", {
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2024-01-15T05:00:00.000Z");
        expect(
            parseIsoDate("2024-07-15", {
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2024-07-15T04:00:00.000Z");
        expect(
            parseIsoDate("2024-09-08", {
                timeZone: "America/Santiago",
            })?.toISOString(),
        ).toBe("2024-09-08T04:00:00.000Z");
    });

    it("accepts leap day and the year bounds, and rejects impossible days", () => {
        expect(
            parseIsoDate("2024-02-29", { timeZone: "UTC" })?.toISOString(),
        ).toBe("2024-02-29T00:00:00.000Z");
        expect(parseIsoDate("2023-02-29", { timeZone: "UTC" })).toBeUndefined();
        expect(parseIsoDate("1900-02-29", { timeZone: "UTC" })).toBeUndefined();
        expect(parseIsoDate("2024-02-30", { timeZone: "UTC" })).toBeUndefined();
        expect(parseIsoDate("2024-04-31", { timeZone: "UTC" })).toBeUndefined();
        expect(
            parseIsoDate("2026-01-31", { timeZone: "UTC" })?.toISOString(),
        ).toBe("2026-01-31T00:00:00.000Z");
        expect(
            parseIsoDate("0000-02-29", { timeZone: "UTC" })?.toISOString(),
        ).toBe("0000-02-29T00:00:00.000Z");
        expect(
            parseIsoDate("9999-12-31", { timeZone: "UTC" })?.toISOString(),
        ).toBe("9999-12-31T00:00:00.000Z");
        expect(parseIsoDate("0000-02-30", { timeZone: "UTC" })).toBeUndefined();
    });

    it("returns undefined for text that is not a calendar date", () => {
        const rejected = [
            "",
            "2026-11-26 ",
            " 2026-11-26",
            "2026-11-26T00:00:00Z",
            "20261126",
            "2026-1-26",
            "not a date",
        ];

        for (const value of rejected) {
            expect(parseIsoDate(value, { timeZone: "UTC" })).toBeUndefined();
        }
    });

    it("uses the system zone when timeZone is omitted", () => {
        const parsed = parseIsoDate("2026-11-26");
        const parts = getDateParts(parsed ?? new Date(Number.NaN));

        expect(parsed).toBeInstanceOf(Date);
        expect(parts.year).toBe(2026);
        expect(parts.month).toBe(11);
        expect(parts.day).toBe(26);
        expect(parts.hour).toBe(0);
        expect(parts.minute).toBe(0);
        expect(parts.second).toBe(0);
    });

    it("throws when the text is not a string or the zone is unusable", () => {
        expect(() => parseIsoDate(20261126 as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseIsoDate(null as unknown as string)).toThrow(
            "`value` must be a string; received object.",
        );
        expect(() =>
            parseIsoDate("2026-11-26", { timeZone: "Mars/Base" }),
        ).toThrow(RangeError);
    });
});
