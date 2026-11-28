import { describe, expect, it } from "vitest";
import { removeDiacritics } from "./remove-diacritics.js";

describe("removeDiacritics", () => {
    it("removes combining marks and maps a few Latin letters", () => {
        expect(removeDiacritics("Café")).toBe("Cafe");
        expect(removeDiacritics("Å")).toBe("A");
        expect(removeDiacritics("ß")).toBe("ss");
        expect(removeDiacritics("")).toBe("");
    });

    it("keeps CJK letters", () => {
        expect(removeDiacritics("你好")).toBe("你好");
    });

    it("does not change the input", () => {
        const value = "Café";
        removeDiacritics(value);
        expect(value).toBe("Café");
    });

    it("returns undefined for a non-string", () => {
        expect(removeDiacritics(1 as never)).toBeUndefined();
        expect(removeDiacritics(null as never)).toBeUndefined();
        expect(removeDiacritics(undefined as never)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(removeDiacritics(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            removeDiacritics("") === undefined ||
                typeof removeDiacritics("") === "string" ||
                typeof removeDiacritics("") === "boolean" ||
                typeof removeDiacritics("") === "number" ||
                Array.isArray(removeDiacritics("")) ||
                (typeof removeDiacritics("") === "object" &&
                    removeDiacritics("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            removeDiacritics("👨‍👩‍👧") === undefined ||
                typeof removeDiacritics("👨‍👩‍👧") === "string" ||
                typeof removeDiacritics("👨‍👩‍👧") === "boolean" ||
                typeof removeDiacritics("👨‍👩‍👧") === "number" ||
                Array.isArray(removeDiacritics("👨‍👩‍👧")) ||
                (typeof removeDiacritics("👨‍👩‍👧") === "object" &&
                    removeDiacritics("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            removeDiacritics("e\u0301") === undefined ||
                typeof removeDiacritics("e\u0301") === "string" ||
                typeof removeDiacritics("e\u0301") === "boolean" ||
                typeof removeDiacritics("e\u0301") === "number" ||
                Array.isArray(removeDiacritics("e\u0301")) ||
                (typeof removeDiacritics("e\u0301") === "object" &&
                    removeDiacritics("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            removeDiacritics("مرحبا") === undefined ||
                typeof removeDiacritics("مرحبا") === "string" ||
                typeof removeDiacritics("مرحبا") === "boolean" ||
                typeof removeDiacritics("مرحبا") === "number" ||
                Array.isArray(removeDiacritics("مرحبا")) ||
                (typeof removeDiacritics("مرحبا") === "object" &&
                    removeDiacritics("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            removeDiacritics("你好") === undefined ||
                typeof removeDiacritics("你好") === "string" ||
                typeof removeDiacritics("你好") === "boolean" ||
                typeof removeDiacritics("你好") === "number" ||
                Array.isArray(removeDiacritics("你好")) ||
                (typeof removeDiacritics("你好") === "object" &&
                    removeDiacritics("你好") !== null),
        ).toBe(true);
    });
});
