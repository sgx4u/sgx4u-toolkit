import { describe, expect, it } from "vitest";
import { isBase32 } from "./is-base32.js";
describe("isBase32", () => {
    it("accepts the alphabet", () => {
        expect(isBase32("MZXW6===")).toBe(true);
        expect(isBase32("018")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isBase32(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isBase32("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isBase32("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isBase32("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isBase32("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isBase32("你好")).toBe("boolean");
    });
});
