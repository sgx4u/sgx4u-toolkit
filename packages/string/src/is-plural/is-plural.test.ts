import { describe, expect, it } from "vitest";
import { isPlural } from "./is-plural.js";
describe("isPlural", () => {
    it("detects plurals and uncountables", () => {
        expect(isPlural("cats")).toBe(true);
        expect(isPlural("cat")).toBe(false);
        expect(isPlural("sheep")).toBe(true);
        expect(isPlural("")).toBe(false);
        expect(isPlural(null as unknown as string)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isPlural(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isPlural("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isPlural("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isPlural("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isPlural("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isPlural("你好")).toBe("boolean");
    });
    it("throws when locale is empty or not text", () => {
        expect(() => isPlural({ value: "a", locale: "" })).toThrow(RangeError);
        expect(() => isPlural({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
