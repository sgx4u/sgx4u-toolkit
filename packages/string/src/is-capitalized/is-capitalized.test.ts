import { describe, expect, it } from "vitest";
import { isCapitalized } from "./is-capitalized.js";

describe("isCapitalized", () => {
    it("looks at the first grapheme", () => {
        expect(isCapitalized("Hello")).toBe(true);
        expect(isCapitalized("hello")).toBe(false);
        expect(isCapitalized("")).toBe(false);
        expect(isCapitalized("1abc")).toBe(false);
        expect(isCapitalized("Éclair")).toBe(true);
        expect(isCapitalized(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isCapitalized(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isCapitalized("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isCapitalized("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isCapitalized("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isCapitalized("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isCapitalized("你好")).toBe("boolean");
    });
});
