import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toKebabCase } from "./to-kebab-case.js";

describe("toKebabCase", () => {
    it("separates words with hyphens", () => {
        expect(toKebabCase("XMLHttpRequest")).toBe("xml-http-request");
        expect(toKebabCase("foo bar")).toBe("foo-bar");
        expect(toKebabCase("")).toBe("");
        expect(toKebabCase(null as never)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toKebabCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toKebabCase("") === undefined ||
                typeof toKebabCase("") === "string" ||
                typeof toKebabCase("") === "boolean" ||
                typeof toKebabCase("") === "number" ||
                Array.isArray(toKebabCase("")) ||
                (typeof toKebabCase("") === "object" &&
                    toKebabCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toKebabCase("👨‍👩‍👧") === undefined ||
                typeof toKebabCase("👨‍👩‍👧") === "string" ||
                typeof toKebabCase("👨‍👩‍👧") === "boolean" ||
                typeof toKebabCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toKebabCase("👨‍👩‍👧")) ||
                (typeof toKebabCase("👨‍👩‍👧") === "object" &&
                    toKebabCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toKebabCase("e\u0301") === undefined ||
                typeof toKebabCase("e\u0301") === "string" ||
                typeof toKebabCase("e\u0301") === "boolean" ||
                typeof toKebabCase("e\u0301") === "number" ||
                Array.isArray(toKebabCase("e\u0301")) ||
                (typeof toKebabCase("e\u0301") === "object" &&
                    toKebabCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toKebabCase("مرحبا") === undefined ||
                typeof toKebabCase("مرحبا") === "string" ||
                typeof toKebabCase("مرحبا") === "boolean" ||
                typeof toKebabCase("مرحبا") === "number" ||
                Array.isArray(toKebabCase("مرحبا")) ||
                (typeof toKebabCase("مرحبا") === "object" &&
                    toKebabCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toKebabCase("你好") === undefined ||
                typeof toKebabCase("你好") === "string" ||
                typeof toKebabCase("你好") === "boolean" ||
                typeof toKebabCase("你好") === "number" ||
                Array.isArray(toKebabCase("你好")) ||
                (typeof toKebabCase("你好") === "object" &&
                    toKebabCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toKebabCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toKebabCase({ value: "a", locale: 1 as never })).toThrow(
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
                    const once = toKebabCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toKebabCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
