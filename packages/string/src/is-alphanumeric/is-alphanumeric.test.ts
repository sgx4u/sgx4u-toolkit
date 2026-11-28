import { describe, expect, it } from "vitest";
import { isAlphanumeric } from "./is-alphanumeric.js";

describe("isAlphanumeric", () => {
    it("allows letters and digits", () => {
        expect(isAlphanumeric("abc123")).toBe(true);
        expect(isAlphanumeric("")).toBe(false);
        expect(isAlphanumeric("ab c")).toBe(false);
        expect(isAlphanumeric({ value: "abc123", locale: "ascii" })).toBe(true);
        expect(isAlphanumeric({ value: "ä1", locale: "ascii" })).toBe(false);
        expect(isAlphanumeric({ value: "١٢٣", locale: "ar" })).toBe(true);
        expect(isAlphanumeric({ value: "abc123", locale: "en" })).toBe(true);
        expect(isAlphanumeric(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isAlphanumeric(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isAlphanumeric("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isAlphanumeric("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isAlphanumeric("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isAlphanumeric("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isAlphanumeric("你好")).toBe("boolean");
    });
    it("throws when locale is empty or not text", () => {
        expect(() => isAlphanumeric({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            isAlphanumeric({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
