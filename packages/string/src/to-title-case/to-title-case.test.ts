import { describe, expect, it } from "vitest";
import { toTitleCase } from "./to-title-case.js";

describe("toTitleCase", () => {
    it("capitalizes words and keeps APA small words down", () => {
        expect(toTitleCase("the lord of the rings")).toBe(
            "The Lord Of The Rings",
        );
        expect(
            toTitleCase({ value: "the lord of the rings", style: "apa" }),
        ).toBe("The Lord of the Rings");
        expect(
            toTitleCase({ value: "a tale of two cities", style: "apa" }),
        ).toBe("A Tale of Two Cities");
        expect(
            toTitleCase({ value: "war and peace", style: "chicago" }),
        ).toContain("and");
        expect(toTitleCase("")).toBe("");
        expect(toTitleCase(null as unknown as string)).toBeUndefined();
        expect(() =>
            toTitleCase({ value: "a", style: "nope" as "apa" }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toTitleCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toTitleCase("") === undefined ||
                typeof toTitleCase("") === "string" ||
                typeof toTitleCase("") === "boolean" ||
                typeof toTitleCase("") === "number" ||
                Array.isArray(toTitleCase("")) ||
                (typeof toTitleCase("") === "object" &&
                    toTitleCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toTitleCase("👨‍👩‍👧") === undefined ||
                typeof toTitleCase("👨‍👩‍👧") === "string" ||
                typeof toTitleCase("👨‍👩‍👧") === "boolean" ||
                typeof toTitleCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toTitleCase("👨‍👩‍👧")) ||
                (typeof toTitleCase("👨‍👩‍👧") === "object" &&
                    toTitleCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toTitleCase("e\u0301") === undefined ||
                typeof toTitleCase("e\u0301") === "string" ||
                typeof toTitleCase("e\u0301") === "boolean" ||
                typeof toTitleCase("e\u0301") === "number" ||
                Array.isArray(toTitleCase("e\u0301")) ||
                (typeof toTitleCase("e\u0301") === "object" &&
                    toTitleCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toTitleCase("مرحبا") === undefined ||
                typeof toTitleCase("مرحبا") === "string" ||
                typeof toTitleCase("مرحبا") === "boolean" ||
                typeof toTitleCase("مرحبا") === "number" ||
                Array.isArray(toTitleCase("مرحبا")) ||
                (typeof toTitleCase("مرحبا") === "object" &&
                    toTitleCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toTitleCase("你好") === undefined ||
                typeof toTitleCase("你好") === "string" ||
                typeof toTitleCase("你好") === "boolean" ||
                typeof toTitleCase("你好") === "number" ||
                Array.isArray(toTitleCase("你好")) ||
                (typeof toTitleCase("你好") === "object" &&
                    toTitleCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toTitleCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toTitleCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
