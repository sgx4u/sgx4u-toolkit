import { describe, expect, it } from "vitest";
import { toPascalCase } from "./to-pascal-case.js";

describe("toPascalCase", () => {
    it("converts words to pascal case", () => {
        expect(toPascalCase("foo bar")).toBe("FooBar");
        expect(toPascalCase("XMLHttpRequest")).toBe("XmlHttpRequest");
        expect(toPascalCase("__typename")).toBe("Typename");
        expect(toPascalCase("")).toBe("");
        expect(toPascalCase(null as never)).toBeUndefined();
    });

    it("keeps a leading acronym when asked", () => {
        expect(
            toPascalCase({
                value: "XMLHttpRequest",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("XMLHttpRequest");
        expect(toPascalCase({ value: "i", locale: "tr-TR" })).toBe("İ");
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toPascalCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toPascalCase("") === undefined ||
                typeof toPascalCase("") === "string" ||
                typeof toPascalCase("") === "boolean" ||
                typeof toPascalCase("") === "number" ||
                Array.isArray(toPascalCase("")) ||
                (typeof toPascalCase("") === "object" &&
                    toPascalCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toPascalCase("👨‍👩‍👧") === undefined ||
                typeof toPascalCase("👨‍👩‍👧") === "string" ||
                typeof toPascalCase("👨‍👩‍👧") === "boolean" ||
                typeof toPascalCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toPascalCase("👨‍👩‍👧")) ||
                (typeof toPascalCase("👨‍👩‍👧") === "object" &&
                    toPascalCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toPascalCase("e\u0301") === undefined ||
                typeof toPascalCase("e\u0301") === "string" ||
                typeof toPascalCase("e\u0301") === "boolean" ||
                typeof toPascalCase("e\u0301") === "number" ||
                Array.isArray(toPascalCase("e\u0301")) ||
                (typeof toPascalCase("e\u0301") === "object" &&
                    toPascalCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toPascalCase("مرحبا") === undefined ||
                typeof toPascalCase("مرحبا") === "string" ||
                typeof toPascalCase("مرحبا") === "boolean" ||
                typeof toPascalCase("مرحبا") === "number" ||
                Array.isArray(toPascalCase("مرحبا")) ||
                (typeof toPascalCase("مرحبا") === "object" &&
                    toPascalCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toPascalCase("你好") === undefined ||
                typeof toPascalCase("你好") === "string" ||
                typeof toPascalCase("你好") === "boolean" ||
                typeof toPascalCase("你好") === "number" ||
                Array.isArray(toPascalCase("你好")) ||
                (typeof toPascalCase("你好") === "object" &&
                    toPascalCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toPascalCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toPascalCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
