import { describe, expect, it } from "vitest";
import { matches } from "./matches.js";
describe("matches", () => {
    it("tests a literal or a regular expression", () => {
        expect(matches({ value: "hello", pattern: "ell" })).toBe(true);
        expect(matches({ value: "hello", pattern: /h.llo/u })).toBe(true);
        expect(matches({ value: 1 as never, pattern: "a" })).toBe(false);
        expect(() => matches({ value: "a", pattern: 1 as never })).toThrow(
            TypeError,
        );
        const expression = /a/g;
        expression.lastIndex = 1;
        expect(matches({ value: "a", pattern: expression })).toBe(true);
        expect(expression.lastIndex).toBe(1);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(matches(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof matches({ value: "", pattern: "ell" })).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof matches({ value: "👨‍👩‍👧", pattern: "ell" })).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof matches({ value: "e\u0301", pattern: "ell" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof matches({ value: "مرحبا", pattern: "ell" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof matches({ value: "你好", pattern: "ell" })).toBe(
            "boolean",
        );
    });
});
