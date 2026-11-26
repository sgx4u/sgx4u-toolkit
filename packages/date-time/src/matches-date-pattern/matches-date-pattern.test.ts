import { describe, expect, it } from "vitest";
import { matchesDatePattern } from "../index.js";

describe("matchesDatePattern", () => {
    it("accepts a real calendar date and rejects an impossible one", () => {
        expect(
            matchesDatePattern({ value: "2026-11-26", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            matchesDatePattern({ value: "2024-02-29", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            matchesDatePattern({ value: "2023-02-29", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(
            matchesDatePattern({ value: "1900-02-29", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(
            matchesDatePattern({ value: "2024-02-30", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(
            matchesDatePattern({ value: "2024-04-31", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(
            matchesDatePattern({ value: "2026-01-31", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            matchesDatePattern({ value: "2026-04-30", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            matchesDatePattern({ value: "0000-02-29", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            matchesDatePattern({ value: "0000-02-30", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(
            matchesDatePattern({ value: "9999-12-31", pattern: "yyyy-MM-dd" }),
        ).toBe(true);
        expect(
            matchesDatePattern({ value: "9999-13-01", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(matchesDatePattern({ value: "", pattern: "yyyy-MM-dd" })).toBe(
            false,
        );
        expect(
            matchesDatePattern({ value: "2026-11-26 ", pattern: "yyyy-MM-dd" }),
        ).toBe(false);
        expect(matchesDatePattern({ value: "2026", pattern: "yyyy" })).toBe(
            true,
        );
    });

    it("matches a localized month name", () => {
        expect(
            matchesDatePattern({
                value: "November 26, 2026",
                pattern: "MMMM d, yyyy",
                locale: "en-US",
            }),
        ).toBe(true);
        expect(
            matchesDatePattern({
                value: "February 29, 2024",
                pattern: "MMMM d, yyyy",
                locale: "en-US",
            }),
        ).toBe(true);
        expect(
            matchesDatePattern({
                value: "February 29, 2023",
                pattern: "MMMM d, yyyy",
                locale: "en-US",
            }),
        ).toBe(false);
        expect(
            matchesDatePattern({
                value: "26 novembre 2026",
                pattern: "d MMMM yyyy",
                locale: "fr-FR",
            }),
        ).toBe(true);
    });

    it("throws when an argument is not a string or the pattern is unknown", () => {
        expect(() =>
            matchesDatePattern({
                value: 20261126 as unknown as string,
                pattern: "yyyy-MM-dd",
            }),
        ).toThrow(TypeError);
        expect(() =>
            matchesDatePattern({
                value: "2026-11-26",
                pattern: null as unknown as string,
            }),
        ).toThrow(TypeError);
        expect(() =>
            matchesDatePattern({ value: "2026", pattern: "QQQQQ" }),
        ).toThrow(RangeError);
    });
});
