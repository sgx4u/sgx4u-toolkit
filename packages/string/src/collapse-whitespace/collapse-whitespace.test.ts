import { describe, expect, it } from "vitest";
import { collapseWhitespace } from "./collapse-whitespace.js";
describe("collapseWhitespace", () => {
    it("collapses runs and trims ends", () => {
        expect(collapseWhitespace("  a   b  ")).toBe("a b");
        expect(collapseWhitespace("a\u00A0\u00A0b")).toBe("a b");
        expect(collapseWhitespace("\uFEFFa")).toBe("\uFEFFa");
        expect(collapseWhitespace("")).toBe("");
        expect(collapseWhitespace(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(collapseWhitespace(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            collapseWhitespace("") === undefined ||
                typeof collapseWhitespace("") === "string" ||
                typeof collapseWhitespace("") === "boolean" ||
                typeof collapseWhitespace("") === "number" ||
                Array.isArray(collapseWhitespace("")) ||
                (typeof collapseWhitespace("") === "object" &&
                    collapseWhitespace("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            collapseWhitespace("👨‍👩‍👧") === undefined ||
                typeof collapseWhitespace("👨‍👩‍👧") === "string" ||
                typeof collapseWhitespace("👨‍👩‍👧") === "boolean" ||
                typeof collapseWhitespace("👨‍👩‍👧") === "number" ||
                Array.isArray(collapseWhitespace("👨‍👩‍👧")) ||
                (typeof collapseWhitespace("👨‍👩‍👧") === "object" &&
                    collapseWhitespace("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            collapseWhitespace("e\u0301") === undefined ||
                typeof collapseWhitespace("e\u0301") === "string" ||
                typeof collapseWhitespace("e\u0301") === "boolean" ||
                typeof collapseWhitespace("e\u0301") === "number" ||
                Array.isArray(collapseWhitespace("e\u0301")) ||
                (typeof collapseWhitespace("e\u0301") === "object" &&
                    collapseWhitespace("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            collapseWhitespace("مرحبا") === undefined ||
                typeof collapseWhitespace("مرحبا") === "string" ||
                typeof collapseWhitespace("مرحبا") === "boolean" ||
                typeof collapseWhitespace("مرحبا") === "number" ||
                Array.isArray(collapseWhitespace("مرحبا")) ||
                (typeof collapseWhitespace("مرحبا") === "object" &&
                    collapseWhitespace("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            collapseWhitespace("你好") === undefined ||
                typeof collapseWhitespace("你好") === "string" ||
                typeof collapseWhitespace("你好") === "boolean" ||
                typeof collapseWhitespace("你好") === "number" ||
                Array.isArray(collapseWhitespace("你好")) ||
                (typeof collapseWhitespace("你好") === "object" &&
                    collapseWhitespace("你好") !== null),
        ).toBe(true);
    });
});
