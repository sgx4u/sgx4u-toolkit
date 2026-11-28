import { describe, expect, it } from "vitest";
import { isBase64 } from "./is-base64.js";
describe("isBase64", () => {
    it("accepts padded text", () => {
        expect(isBase64("YQ==")).toBe(true);
        expect(isBase64("$$$")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isBase64(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isBase64("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isBase64("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isBase64("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isBase64("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isBase64("你好")).toBe("boolean");
    });
});
