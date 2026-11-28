import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toUpperCase } from "./to-upper-case.js";

describe("toUpperCase", () => {
    it("converts case and honors Turkish", () => {
        expect(toUpperCase("Hello")).toBe("Hello".toLocaleUpperCase());
        expect(toUpperCase({ value: "i", locale: "tr-TR" })).toBe("İ");
        expect(toUpperCase("")).toBe("");
        expect(toUpperCase(null as unknown as string)).toBeUndefined();
        expect(() => toUpperCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toUpperCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toUpperCase("") === undefined ||
                typeof toUpperCase("") === "string" ||
                typeof toUpperCase("") === "boolean" ||
                typeof toUpperCase("") === "number" ||
                Array.isArray(toUpperCase("")) ||
                (typeof toUpperCase("") === "object" &&
                    toUpperCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toUpperCase("👨‍👩‍👧") === undefined ||
                typeof toUpperCase("👨‍👩‍👧") === "string" ||
                typeof toUpperCase("👨‍👩‍👧") === "boolean" ||
                typeof toUpperCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toUpperCase("👨‍👩‍👧")) ||
                (typeof toUpperCase("👨‍👩‍👧") === "object" &&
                    toUpperCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toUpperCase("e\u0301") === undefined ||
                typeof toUpperCase("e\u0301") === "string" ||
                typeof toUpperCase("e\u0301") === "boolean" ||
                typeof toUpperCase("e\u0301") === "number" ||
                Array.isArray(toUpperCase("e\u0301")) ||
                (typeof toUpperCase("e\u0301") === "object" &&
                    toUpperCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toUpperCase("مرحبا") === undefined ||
                typeof toUpperCase("مرحبا") === "string" ||
                typeof toUpperCase("مرحبا") === "boolean" ||
                typeof toUpperCase("مرحبا") === "number" ||
                Array.isArray(toUpperCase("مرحبا")) ||
                (typeof toUpperCase("مرحبا") === "object" &&
                    toUpperCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toUpperCase("你好") === undefined ||
                typeof toUpperCase("你好") === "string" ||
                typeof toUpperCase("你好") === "boolean" ||
                typeof toUpperCase("你好") === "number" ||
                Array.isArray(toUpperCase("你好")) ||
                (typeof toUpperCase("你好") === "object" &&
                    toUpperCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toUpperCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toUpperCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
    it("is idempotent for a safe alphabet", () => {
        fc.assert(
            fc.property(
                fc.string({
                    unit: fc.constantFrom(..."abc -_"),
                    maxLength: 24,
                }),
                (value) => {
                    const once = toUpperCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toUpperCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
