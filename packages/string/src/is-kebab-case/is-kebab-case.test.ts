import { describe, expect, it } from "vitest";
import { isKebabCase } from "./is-kebab-case.js";

describe("isKebabCase", () => {
    it("accepts the kebab-case conversion", () => {
        expect(isKebabCase("xml-http-request")).toBe(true);
        expect(isKebabCase("foo")).toBe(true);
        expect(isKebabCase("fooBar")).toBe(false);
        expect(isKebabCase("")).toBe(false);
        expect(isKebabCase(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isKebabCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isKebabCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isKebabCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isKebabCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isKebabCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isKebabCase("你好")).toBe("boolean");
    });
});
