import { describe, expect, it } from "vitest";
import { isMimeType } from "./is-mime-type.js";
describe("isMimeType", () => {
    it("requires type/subtype", () => {
        expect(isMimeType("text/plain")).toBe(true);
        expect(isMimeType("text")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isMimeType(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isMimeType("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isMimeType("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isMimeType("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isMimeType("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isMimeType("你好")).toBe("boolean");
    });
});
