import { describe, expect, it } from "vitest";
import { hasHalfWidthCharacter } from "./has-half-width-character.js";

describe("hasHalfWidthCharacter", () => {
    it("detects halfwidth forms", () => {
        expect(hasHalfWidthCharacter("ｱ")).toBe(true);
        expect(hasHalfWidthCharacter("abc")).toBe(false);
        expect(hasHalfWidthCharacter("あ")).toBe(false);
        expect(hasHalfWidthCharacter(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(hasHalfWidthCharacter(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof hasHalfWidthCharacter("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof hasHalfWidthCharacter("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof hasHalfWidthCharacter("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof hasHalfWidthCharacter("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof hasHalfWidthCharacter("你好")).toBe("boolean");
    });
});
