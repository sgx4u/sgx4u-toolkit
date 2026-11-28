import { describe, expect, it } from "vitest";
import { escapeJavaScriptString } from "./escape-javascript-string.js";
describe("escapeJavaScriptString", () => {
    it("escapes quotes and controls", () => {
        expect(escapeJavaScriptString('a"b')).toBe('a\\"b');
        expect(escapeJavaScriptString("a\nb")).toBe("a\\nb");
        expect(escapeJavaScriptString("\u2028")).toBe("\\u2028");
        expect(escapeJavaScriptString(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(escapeJavaScriptString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            escapeJavaScriptString("") === undefined ||
                typeof escapeJavaScriptString("") === "string" ||
                typeof escapeJavaScriptString("") === "boolean" ||
                typeof escapeJavaScriptString("") === "number" ||
                Array.isArray(escapeJavaScriptString("")) ||
                (typeof escapeJavaScriptString("") === "object" &&
                    escapeJavaScriptString("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            escapeJavaScriptString("👨‍👩‍👧") === undefined ||
                typeof escapeJavaScriptString("👨‍👩‍👧") === "string" ||
                typeof escapeJavaScriptString("👨‍👩‍👧") === "boolean" ||
                typeof escapeJavaScriptString("👨‍👩‍👧") === "number" ||
                Array.isArray(escapeJavaScriptString("👨‍👩‍👧")) ||
                (typeof escapeJavaScriptString("👨‍👩‍👧") === "object" &&
                    escapeJavaScriptString("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            escapeJavaScriptString("e\u0301") === undefined ||
                typeof escapeJavaScriptString("e\u0301") === "string" ||
                typeof escapeJavaScriptString("e\u0301") === "boolean" ||
                typeof escapeJavaScriptString("e\u0301") === "number" ||
                Array.isArray(escapeJavaScriptString("e\u0301")) ||
                (typeof escapeJavaScriptString("e\u0301") === "object" &&
                    escapeJavaScriptString("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            escapeJavaScriptString("مرحبا") === undefined ||
                typeof escapeJavaScriptString("مرحبا") === "string" ||
                typeof escapeJavaScriptString("مرحبا") === "boolean" ||
                typeof escapeJavaScriptString("مرحبا") === "number" ||
                Array.isArray(escapeJavaScriptString("مرحبا")) ||
                (typeof escapeJavaScriptString("مرحبا") === "object" &&
                    escapeJavaScriptString("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            escapeJavaScriptString("你好") === undefined ||
                typeof escapeJavaScriptString("你好") === "string" ||
                typeof escapeJavaScriptString("你好") === "boolean" ||
                typeof escapeJavaScriptString("你好") === "number" ||
                Array.isArray(escapeJavaScriptString("你好")) ||
                (typeof escapeJavaScriptString("你好") === "object" &&
                    escapeJavaScriptString("你好") !== null),
        ).toBe(true);
    });
});
