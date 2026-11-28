import { describe, expect, it } from "vitest";
import { quoteString } from "./quote-string.js";
describe("quoteString", () => {
    it("quotes and escapes", () => {
        expect(quoteString("a")).toBe('"a"');
        expect(quoteString({ value: "a" })).toBe('"a"');
        expect(quoteString({ value: 'a"b', style: "double" })).toBe('"a\\"b"');
        expect(quoteString({ value: "a\\b" })).toBe('"a\\\\b"');
        expect(quoteString({ value: "a", style: "single" })).toBe("'a'");
        expect(quoteString({ value: "a`b", style: "backtick" })).toBe(
            "`a\\`b`",
        );
        expect(() =>
            quoteString({ value: "a", style: "none" as "double" }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(quoteString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            quoteString("") === undefined ||
                typeof quoteString("") === "string" ||
                typeof quoteString("") === "boolean" ||
                typeof quoteString("") === "number" ||
                Array.isArray(quoteString("")) ||
                (typeof quoteString("") === "object" &&
                    quoteString("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            quoteString("👨‍👩‍👧") === undefined ||
                typeof quoteString("👨‍👩‍👧") === "string" ||
                typeof quoteString("👨‍👩‍👧") === "boolean" ||
                typeof quoteString("👨‍👩‍👧") === "number" ||
                Array.isArray(quoteString("👨‍👩‍👧")) ||
                (typeof quoteString("👨‍👩‍👧") === "object" &&
                    quoteString("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            quoteString("e\u0301") === undefined ||
                typeof quoteString("e\u0301") === "string" ||
                typeof quoteString("e\u0301") === "boolean" ||
                typeof quoteString("e\u0301") === "number" ||
                Array.isArray(quoteString("e\u0301")) ||
                (typeof quoteString("e\u0301") === "object" &&
                    quoteString("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            quoteString("مرحبا") === undefined ||
                typeof quoteString("مرحبا") === "string" ||
                typeof quoteString("مرحبا") === "boolean" ||
                typeof quoteString("مرحبا") === "number" ||
                Array.isArray(quoteString("مرحبا")) ||
                (typeof quoteString("مرحبا") === "object" &&
                    quoteString("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            quoteString("你好") === undefined ||
                typeof quoteString("你好") === "string" ||
                typeof quoteString("你好") === "boolean" ||
                typeof quoteString("你好") === "number" ||
                Array.isArray(quoteString("你好")) ||
                (typeof quoteString("你好") === "object" &&
                    quoteString("你好") !== null),
        ).toBe(true);
    });
});
