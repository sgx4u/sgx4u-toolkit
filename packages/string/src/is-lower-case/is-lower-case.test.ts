import { describe, expect, it } from "vitest";
import { isLowerCase } from "./is-lower-case.js";

describe("isLowerCase", () => {
    it("requires a cased letter that is already lower", () => {
        expect(isLowerCase("abc")).toBe(true);
        expect(isLowerCase("abc123")).toBe(true);
        expect(isLowerCase("ABC")).toBe(false);
        expect(isLowerCase("123")).toBe(false);
        expect(isLowerCase("")).toBe(false);
        expect(isLowerCase(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isLowerCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isLowerCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isLowerCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isLowerCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isLowerCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isLowerCase("你好")).toBe("boolean");
    });
});
