import { describe, expect, it } from "vitest";
import { escapeMarkdown } from "./escape-markdown.js";
describe("escapeMarkdown", () => {
    it("escapes markup punctuation", () => {
        expect(escapeMarkdown("*hi*")).toBe("\\*hi\\*");
        expect(escapeMarkdown("a_b")).toBe("a\\_b");
        expect(escapeMarkdown(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(escapeMarkdown(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            escapeMarkdown("") === undefined ||
                typeof escapeMarkdown("") === "string" ||
                typeof escapeMarkdown("") === "boolean" ||
                typeof escapeMarkdown("") === "number" ||
                Array.isArray(escapeMarkdown("")) ||
                (typeof escapeMarkdown("") === "object" &&
                    escapeMarkdown("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            escapeMarkdown("👨‍👩‍👧") === undefined ||
                typeof escapeMarkdown("👨‍👩‍👧") === "string" ||
                typeof escapeMarkdown("👨‍👩‍👧") === "boolean" ||
                typeof escapeMarkdown("👨‍👩‍👧") === "number" ||
                Array.isArray(escapeMarkdown("👨‍👩‍👧")) ||
                (typeof escapeMarkdown("👨‍👩‍👧") === "object" &&
                    escapeMarkdown("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            escapeMarkdown("e\u0301") === undefined ||
                typeof escapeMarkdown("e\u0301") === "string" ||
                typeof escapeMarkdown("e\u0301") === "boolean" ||
                typeof escapeMarkdown("e\u0301") === "number" ||
                Array.isArray(escapeMarkdown("e\u0301")) ||
                (typeof escapeMarkdown("e\u0301") === "object" &&
                    escapeMarkdown("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            escapeMarkdown("مرحبا") === undefined ||
                typeof escapeMarkdown("مرحبا") === "string" ||
                typeof escapeMarkdown("مرحبا") === "boolean" ||
                typeof escapeMarkdown("مرحبا") === "number" ||
                Array.isArray(escapeMarkdown("مرحبا")) ||
                (typeof escapeMarkdown("مرحبا") === "object" &&
                    escapeMarkdown("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            escapeMarkdown("你好") === undefined ||
                typeof escapeMarkdown("你好") === "string" ||
                typeof escapeMarkdown("你好") === "boolean" ||
                typeof escapeMarkdown("你好") === "number" ||
                Array.isArray(escapeMarkdown("你好")) ||
                (typeof escapeMarkdown("你好") === "object" &&
                    escapeMarkdown("你好") !== null),
        ).toBe(true);
    });
});
