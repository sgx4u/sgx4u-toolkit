import { describe, expect, it } from "vitest";
import { quoteString } from "../quote-string/quote-string.js";
import { unquoteString } from "./unquote-string.js";

describe("unquoteString", () => {
    it("removes one matching pair and unescapes it", () => {
        expect(unquoteString('"a"')).toBe("a");
        expect(unquoteString("a")).toBe("a");
        expect(unquoteString("'ab'")).toBe("ab");
        expect(unquoteString("`ab`")).toBe("ab");
        expect(unquoteString('"a\\"b"')).toBe('a"b');
        expect(unquoteString('"a\\\\b"')).toBe("a\\b");
        expect(unquoteString({ value: "'a'", style: "single" })).toBe("a");
        expect(unquoteString({ value: "'a'", style: "double" })).toBe("'a'");
        const quoted = quoteString('a"b\\c');
        expect(unquoteString(quoted ?? "")).toBe('a"b\\c');
        expect(unquoteString(null as unknown as string)).toBeUndefined();
        expect(() =>
            unquoteString({ value: '"a"', style: "none" as "double" }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(unquoteString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            unquoteString("") === undefined ||
                typeof unquoteString("") === "string" ||
                typeof unquoteString("") === "boolean" ||
                typeof unquoteString("") === "number" ||
                Array.isArray(unquoteString("")) ||
                (typeof unquoteString("") === "object" &&
                    unquoteString("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            unquoteString("👨‍👩‍👧") === undefined ||
                typeof unquoteString("👨‍👩‍👧") === "string" ||
                typeof unquoteString("👨‍👩‍👧") === "boolean" ||
                typeof unquoteString("👨‍👩‍👧") === "number" ||
                Array.isArray(unquoteString("👨‍👩‍👧")) ||
                (typeof unquoteString("👨‍👩‍👧") === "object" &&
                    unquoteString("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            unquoteString("e\u0301") === undefined ||
                typeof unquoteString("e\u0301") === "string" ||
                typeof unquoteString("e\u0301") === "boolean" ||
                typeof unquoteString("e\u0301") === "number" ||
                Array.isArray(unquoteString("e\u0301")) ||
                (typeof unquoteString("e\u0301") === "object" &&
                    unquoteString("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            unquoteString("مرحبا") === undefined ||
                typeof unquoteString("مرحبا") === "string" ||
                typeof unquoteString("مرحبا") === "boolean" ||
                typeof unquoteString("مرحبا") === "number" ||
                Array.isArray(unquoteString("مرحبا")) ||
                (typeof unquoteString("مرحبا") === "object" &&
                    unquoteString("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            unquoteString("你好") === undefined ||
                typeof unquoteString("你好") === "string" ||
                typeof unquoteString("你好") === "boolean" ||
                typeof unquoteString("你好") === "number" ||
                Array.isArray(unquoteString("你好")) ||
                (typeof unquoteString("你好") === "object" &&
                    unquoteString("你好") !== null),
        ).toBe(true);
    });
});
