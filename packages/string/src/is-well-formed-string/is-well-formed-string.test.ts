import { describe, expect, it } from "vitest";
import { isWellFormedString } from "./is-well-formed-string.js";

describe("isWellFormedString", () => {
    it("rejects a lone surrogate", () => {
        expect(isWellFormedString("")).toBe(true);
        expect(isWellFormedString("ok")).toBe(true);
        expect(isWellFormedString("\uD800")).toBe(false);
        expect(isWellFormedString(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isWellFormedString(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isWellFormedString("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isWellFormedString("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isWellFormedString("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isWellFormedString("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isWellFormedString("你好")).toBe("boolean");
    });
});
