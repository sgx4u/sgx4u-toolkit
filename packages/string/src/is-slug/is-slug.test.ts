import { describe, expect, it } from "vitest";
import { isSlug } from "./is-slug.js";
describe("isSlug", () => {
    it("accepts a lowercase slug", () => {
        expect(isSlug("hello-world")).toBe(true);
        expect(isSlug("-a")).toBe(false);
        expect(isSlug("A")).toBe(false);
        expect(isSlug(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isSlug(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isSlug("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isSlug("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isSlug("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isSlug("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isSlug("你好")).toBe("boolean");
    });
});
