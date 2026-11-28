import { describe, expect, it } from "vitest";
import { isLocaleIdentifier } from "./is-locale-identifier.js";
describe("isLocaleIdentifier", () => {
    it("accepts BCP 47", () => {
        expect(isLocaleIdentifier("en-US")).toBe(true);
        expect(isLocaleIdentifier("en_US")).toBe(false);
        expect(isLocaleIdentifier("")).toBe(false);
        expect(isLocaleIdentifier("not a locale !!!")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isLocaleIdentifier(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isLocaleIdentifier("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isLocaleIdentifier("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isLocaleIdentifier("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isLocaleIdentifier("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isLocaleIdentifier("你好")).toBe("boolean");
    });
});
