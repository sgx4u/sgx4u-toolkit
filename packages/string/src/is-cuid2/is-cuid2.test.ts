import { describe, expect, it } from "vitest";
import { isCUID2 } from "./is-cuid2.js";
describe("isCUID2", () => {
    it("requires a leading letter", () => {
        expect(isCUID2("a".repeat(24))).toBe(true);
        expect(isCUID2("1".repeat(24))).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isCUID2(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isCUID2("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isCUID2("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isCUID2("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isCUID2("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isCUID2("你好")).toBe("boolean");
    });
});
