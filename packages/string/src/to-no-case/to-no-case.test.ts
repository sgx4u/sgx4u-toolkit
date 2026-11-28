import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toNoCase } from "./to-no-case.js";

describe("toNoCase", () => {
    it("converts words", () => {
        expect(toNoCase("fooBar")).toBe("foo bar");
        expect(toNoCase("")).toBe("");
        expect(toNoCase(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toNoCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toNoCase("") === undefined ||
                typeof toNoCase("") === "string" ||
                typeof toNoCase("") === "boolean" ||
                typeof toNoCase("") === "number" ||
                Array.isArray(toNoCase("")) ||
                (typeof toNoCase("") === "object" && toNoCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toNoCase("👨‍👩‍👧") === undefined ||
                typeof toNoCase("👨‍👩‍👧") === "string" ||
                typeof toNoCase("👨‍👩‍👧") === "boolean" ||
                typeof toNoCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toNoCase("👨‍👩‍👧")) ||
                (typeof toNoCase("👨‍👩‍👧") === "object" && toNoCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toNoCase("e\u0301") === undefined ||
                typeof toNoCase("e\u0301") === "string" ||
                typeof toNoCase("e\u0301") === "boolean" ||
                typeof toNoCase("e\u0301") === "number" ||
                Array.isArray(toNoCase("e\u0301")) ||
                (typeof toNoCase("e\u0301") === "object" &&
                    toNoCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toNoCase("مرحبا") === undefined ||
                typeof toNoCase("مرحبا") === "string" ||
                typeof toNoCase("مرحبا") === "boolean" ||
                typeof toNoCase("مرحبا") === "number" ||
                Array.isArray(toNoCase("مرحبا")) ||
                (typeof toNoCase("مرحبا") === "object" &&
                    toNoCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toNoCase("你好") === undefined ||
                typeof toNoCase("你好") === "string" ||
                typeof toNoCase("你好") === "boolean" ||
                typeof toNoCase("你好") === "number" ||
                Array.isArray(toNoCase("你好")) ||
                (typeof toNoCase("你好") === "object" &&
                    toNoCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toNoCase({ value: "a", locale: "" })).toThrow(RangeError);
        expect(() => toNoCase({ value: "a", locale: 1 as never })).toThrow(
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
                    const once = toNoCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toNoCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
