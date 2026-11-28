import { describe, expect, it } from "vitest";
import { isJWT } from "./is-jwt.js";
describe("isJWT", () => {
    it("requires three parts", () => {
        expect(isJWT("eyJ.eyJ.sig")).toBe(true);
        expect(isJWT("a.b")).toBe(false);
        expect(isJWT(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isJWT(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isJWT("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isJWT("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isJWT("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isJWT("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isJWT("你好")).toBe("boolean");
    });
});
