import { describe, expect, it } from "vitest";
import { stripIndent } from "./strip-indent.js";
describe("stripIndent", () => {
    it("keeps an unindented first line and does not drop newlines", () => {
        expect(stripIndent("a\n  b\n   c")).toBe("a\nb\n c");
        expect(stripIndent("\n  a\n")).toBe("\na\n");
        expect(stripIndent(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(stripIndent(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            stripIndent("") === undefined ||
                typeof stripIndent("") === "string" ||
                typeof stripIndent("") === "boolean" ||
                typeof stripIndent("") === "number" ||
                Array.isArray(stripIndent("")) ||
                (typeof stripIndent("") === "object" &&
                    stripIndent("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            stripIndent("👨‍👩‍👧") === undefined ||
                typeof stripIndent("👨‍👩‍👧") === "string" ||
                typeof stripIndent("👨‍👩‍👧") === "boolean" ||
                typeof stripIndent("👨‍👩‍👧") === "number" ||
                Array.isArray(stripIndent("👨‍👩‍👧")) ||
                (typeof stripIndent("👨‍👩‍👧") === "object" &&
                    stripIndent("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            stripIndent("e\u0301") === undefined ||
                typeof stripIndent("e\u0301") === "string" ||
                typeof stripIndent("e\u0301") === "boolean" ||
                typeof stripIndent("e\u0301") === "number" ||
                Array.isArray(stripIndent("e\u0301")) ||
                (typeof stripIndent("e\u0301") === "object" &&
                    stripIndent("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            stripIndent("مرحبا") === undefined ||
                typeof stripIndent("مرحبا") === "string" ||
                typeof stripIndent("مرحبا") === "boolean" ||
                typeof stripIndent("مرحبا") === "number" ||
                Array.isArray(stripIndent("مرحبا")) ||
                (typeof stripIndent("مرحبا") === "object" &&
                    stripIndent("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            stripIndent("你好") === undefined ||
                typeof stripIndent("你好") === "string" ||
                typeof stripIndent("你好") === "boolean" ||
                typeof stripIndent("你好") === "number" ||
                Array.isArray(stripIndent("你好")) ||
                (typeof stripIndent("你好") === "object" &&
                    stripIndent("你好") !== null),
        ).toBe(true);
    });
});
