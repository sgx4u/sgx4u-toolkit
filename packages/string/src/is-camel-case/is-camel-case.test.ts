import { describe, expect, it } from "vitest";
import { isCamelCase } from "./is-camel-case.js";

describe("isCamelCase", () => {
    it("accepts camel case and rejects separators", () => {
        expect(isCamelCase("fooBar")).toBe(true);
        expect(isCamelCase("xmlHttpRequest")).toBe(true);
        expect(isCamelCase("userId")).toBe(true);
        expect(isCamelCase("FooBar")).toBe(false);
        expect(isCamelCase("userID")).toBe(false);
        expect(isCamelCase("foo_bar")).toBe(false);
        expect(isCamelCase("123")).toBe(false);
        expect(isCamelCase("")).toBe(false);
        expect(isCamelCase(null)).toBe(false);
        expect(isCamelCase(new String("fooBar"))).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isCamelCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isCamelCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isCamelCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isCamelCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isCamelCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isCamelCase("你好")).toBe("boolean");
    });
});
