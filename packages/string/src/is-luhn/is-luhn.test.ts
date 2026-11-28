import { describe, expect, it } from "vitest";
import { isLuhn } from "./is-luhn.js";
describe("isLuhn", () => {
    it("checks the Visa test number", () => {
        expect(isLuhn("4242424242424242")).toBe(true);
        expect(isLuhn("4242424242424243")).toBe(false);
        expect(isLuhn("abc")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isLuhn(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isLuhn("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isLuhn("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isLuhn("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isLuhn("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isLuhn("你好")).toBe("boolean");
    });
});
