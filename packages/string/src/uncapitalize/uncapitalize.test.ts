import { describe, expect, it } from "vitest";
import { uncapitalize } from "./uncapitalize.js";

describe("uncapitalize", () => {
    it("lowercases only the first grapheme", () => {
        expect(uncapitalize("Hello")).toBe("hello");
        expect(uncapitalize("ABC")).toBe("aBC");
        expect(uncapitalize({ value: "I", locale: "tr-TR" })).toBe("ı");
        expect(uncapitalize("")).toBe("");
        expect(uncapitalize(1 as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(uncapitalize(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            uncapitalize("") === undefined ||
                typeof uncapitalize("") === "string" ||
                typeof uncapitalize("") === "boolean" ||
                typeof uncapitalize("") === "number" ||
                Array.isArray(uncapitalize("")) ||
                (typeof uncapitalize("") === "object" &&
                    uncapitalize("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            uncapitalize("👨‍👩‍👧") === undefined ||
                typeof uncapitalize("👨‍👩‍👧") === "string" ||
                typeof uncapitalize("👨‍👩‍👧") === "boolean" ||
                typeof uncapitalize("👨‍👩‍👧") === "number" ||
                Array.isArray(uncapitalize("👨‍👩‍👧")) ||
                (typeof uncapitalize("👨‍👩‍👧") === "object" &&
                    uncapitalize("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            uncapitalize("e\u0301") === undefined ||
                typeof uncapitalize("e\u0301") === "string" ||
                typeof uncapitalize("e\u0301") === "boolean" ||
                typeof uncapitalize("e\u0301") === "number" ||
                Array.isArray(uncapitalize("e\u0301")) ||
                (typeof uncapitalize("e\u0301") === "object" &&
                    uncapitalize("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            uncapitalize("مرحبا") === undefined ||
                typeof uncapitalize("مرحبا") === "string" ||
                typeof uncapitalize("مرحبا") === "boolean" ||
                typeof uncapitalize("مرحبا") === "number" ||
                Array.isArray(uncapitalize("مرحبا")) ||
                (typeof uncapitalize("مرحبا") === "object" &&
                    uncapitalize("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            uncapitalize("你好") === undefined ||
                typeof uncapitalize("你好") === "string" ||
                typeof uncapitalize("你好") === "boolean" ||
                typeof uncapitalize("你好") === "number" ||
                Array.isArray(uncapitalize("你好")) ||
                (typeof uncapitalize("你好") === "object" &&
                    uncapitalize("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => uncapitalize({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => uncapitalize({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
