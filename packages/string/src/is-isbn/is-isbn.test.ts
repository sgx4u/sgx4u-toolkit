import { describe, expect, it } from "vitest";
import { isISBN } from "./is-isbn.js";
describe("isISBN", () => {
    it("checks ISBN-10 and ISBN-13", () => {
        expect(isISBN("0-306-40615-2")).toBe(true);
        expect(isISBN("978-0-306-40615-7")).toBe(true);
        expect(isISBN("0-306-40615-3")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isISBN(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isISBN("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isISBN("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isISBN("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isISBN("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isISBN("你好")).toBe("boolean");
    });
});
