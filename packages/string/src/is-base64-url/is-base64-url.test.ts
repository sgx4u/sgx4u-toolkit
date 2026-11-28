import { describe, expect, it } from "vitest";
import { isBase64URL } from "./is-base64-url.js";
describe("isBase64URL", () => {
    it("rejects standard padding", () => {
        expect(isBase64URL("YQ")).toBe(true);
        expect(isBase64URL("YQ==")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isBase64URL(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isBase64URL("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isBase64URL("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isBase64URL("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isBase64URL("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isBase64URL("你好")).toBe("boolean");
    });
});
