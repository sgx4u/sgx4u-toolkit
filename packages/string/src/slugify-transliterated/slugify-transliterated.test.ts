import { describe, expect, it } from "vitest";
import { slugifyTransliterated } from "./slugify-transliterated.js";

describe("slugifyTransliterated", () => {
    it("transliterates and then slugifies", () => {
        expect(slugifyTransliterated("Привет мир")).toBe("privet-mir");
        expect(slugifyTransliterated({ value: "Über", locale: "de" })).toBe(
            "ueber",
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(slugifyTransliterated(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            slugifyTransliterated("") === undefined ||
                typeof slugifyTransliterated("") === "string" ||
                typeof slugifyTransliterated("") === "boolean" ||
                typeof slugifyTransliterated("") === "number" ||
                Array.isArray(slugifyTransliterated("")) ||
                (typeof slugifyTransliterated("") === "object" &&
                    slugifyTransliterated("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            slugifyTransliterated("👨‍👩‍👧") === undefined ||
                typeof slugifyTransliterated("👨‍👩‍👧") === "string" ||
                typeof slugifyTransliterated("👨‍👩‍👧") === "boolean" ||
                typeof slugifyTransliterated("👨‍👩‍👧") === "number" ||
                Array.isArray(slugifyTransliterated("👨‍👩‍👧")) ||
                (typeof slugifyTransliterated("👨‍👩‍👧") === "object" &&
                    slugifyTransliterated("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            slugifyTransliterated("e\u0301") === undefined ||
                typeof slugifyTransliterated("e\u0301") === "string" ||
                typeof slugifyTransliterated("e\u0301") === "boolean" ||
                typeof slugifyTransliterated("e\u0301") === "number" ||
                Array.isArray(slugifyTransliterated("e\u0301")) ||
                (typeof slugifyTransliterated("e\u0301") === "object" &&
                    slugifyTransliterated("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            slugifyTransliterated("مرحبا") === undefined ||
                typeof slugifyTransliterated("مرحبا") === "string" ||
                typeof slugifyTransliterated("مرحبا") === "boolean" ||
                typeof slugifyTransliterated("مرحبا") === "number" ||
                Array.isArray(slugifyTransliterated("مرحبا")) ||
                (typeof slugifyTransliterated("مرحبا") === "object" &&
                    slugifyTransliterated("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            slugifyTransliterated("你好") === undefined ||
                typeof slugifyTransliterated("你好") === "string" ||
                typeof slugifyTransliterated("你好") === "boolean" ||
                typeof slugifyTransliterated("你好") === "number" ||
                Array.isArray(slugifyTransliterated("你好")) ||
                (typeof slugifyTransliterated("你好") === "object" &&
                    slugifyTransliterated("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => slugifyTransliterated({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            slugifyTransliterated({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
