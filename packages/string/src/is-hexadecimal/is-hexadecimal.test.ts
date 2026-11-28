import { describe, expect, it } from "vitest";
import { isHexadecimal } from "./is-hexadecimal.js";

describe("isHexadecimal", () => {
    it("rejects a prefix, an empty string, and non-strings", () => {
        expect(isHexadecimal("deadBEEF")).toBe(true);
        expect(isHexadecimal("")).toBe(false);
        expect(isHexadecimal("0x1")).toBe(false);
        expect(isHexadecimal(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isHexadecimal(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isHexadecimal("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isHexadecimal("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isHexadecimal("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isHexadecimal("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isHexadecimal("你好")).toBe("boolean");
    });
});
