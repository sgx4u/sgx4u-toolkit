import { describe, expect, it } from "vitest";
import { isUpperCase } from "./is-upper-case.js";

describe("isUpperCase", () => {
    it("requires a cased letter that is already upper", () => {
        expect(isUpperCase("ABC")).toBe(true);
        expect(isUpperCase("abc")).toBe(false);
        expect(isUpperCase("123")).toBe(false);
        expect(isUpperCase("")).toBe(false);
        expect(isUpperCase(1)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isUpperCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isUpperCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isUpperCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isUpperCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isUpperCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isUpperCase("你好")).toBe("boolean");
    });
});
