import { describe, expect, it } from "vitest";
import { hasFullWidthCharacter } from "./has-full-width-character.js";

describe("hasFullWidthCharacter", () => {
    it("detects wide characters and emoji", () => {
        expect(hasFullWidthCharacter("あ")).toBe(true);
        expect(hasFullWidthCharacter("Ａ")).toBe(true);
        expect(hasFullWidthCharacter("😀")).toBe(true);
        expect(hasFullWidthCharacter("abc")).toBe(false);
        expect(hasFullWidthCharacter("")).toBe(false);
        expect(hasFullWidthCharacter(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(hasFullWidthCharacter(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof hasFullWidthCharacter("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof hasFullWidthCharacter("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof hasFullWidthCharacter("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof hasFullWidthCharacter("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof hasFullWidthCharacter("你好")).toBe("boolean");
    });
});
