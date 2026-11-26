import { describe, expect, it } from "vitest";
import { matchesDatePattern } from "../index.js";

describe("matchesDatePattern", () => {
    it("accepts a real calendar date and rejects an impossible one", () => {
        expect(matchesDatePattern("2026-11-26", "yyyy-MM-dd")).toBe(true);
        expect(matchesDatePattern("2024-02-29", "yyyy-MM-dd")).toBe(true);
        expect(matchesDatePattern("2023-02-29", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("1900-02-29", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("2024-02-30", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("2024-04-31", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("2026-01-31", "yyyy-MM-dd")).toBe(true);
        expect(matchesDatePattern("2026-04-30", "yyyy-MM-dd")).toBe(true);
        expect(matchesDatePattern("0000-02-29", "yyyy-MM-dd")).toBe(true);
        expect(matchesDatePattern("0000-02-30", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("9999-12-31", "yyyy-MM-dd")).toBe(true);
        expect(matchesDatePattern("9999-13-01", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("2026-11-26 ", "yyyy-MM-dd")).toBe(false);
        expect(matchesDatePattern("2026", "yyyy")).toBe(true);
    });

    it("matches a localized month name", () => {
        expect(
            matchesDatePattern("November 26, 2026", "MMMM d, yyyy", {
                locale: "en-US",
            }),
        ).toBe(true);
        expect(
            matchesDatePattern("February 29, 2024", "MMMM d, yyyy", {
                locale: "en-US",
            }),
        ).toBe(true);
        expect(
            matchesDatePattern("February 29, 2023", "MMMM d, yyyy", {
                locale: "en-US",
            }),
        ).toBe(false);
        expect(
            matchesDatePattern("26 novembre 2026", "d MMMM yyyy", {
                locale: "fr-FR",
            }),
        ).toBe(true);
    });

    it("throws when an argument is not a string or the pattern is unknown", () => {
        expect(() =>
            matchesDatePattern(20261126 as unknown as string, "yyyy-MM-dd"),
        ).toThrow(TypeError);
        expect(() =>
            matchesDatePattern("2026-11-26", null as unknown as string),
        ).toThrow(TypeError);
        expect(() => matchesDatePattern("2026", "QQQQQ")).toThrow(RangeError);
    });
});
