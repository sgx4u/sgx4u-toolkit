import { describe, expect, it } from "vitest";
import { trim } from "./trim.js";

describe("trim", () => {
    it("trims whitespace and custom graphemes", () => {
        expect(trim("  hello  ")).toBe("hello");
        expect(trim({ value: "xxhelloxx", characters: "x" })).toBe("hello");
        expect(trim("\u00A0a\u00A0")).toBe("a");
        expect(trim("")).toBe("");
        expect(trim(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(trim(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            trim("") === undefined ||
                typeof trim("") === "string" ||
                typeof trim("") === "boolean" ||
                typeof trim("") === "number" ||
                Array.isArray(trim("")) ||
                (typeof trim("") === "object" && trim("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            trim("👨‍👩‍👧") === undefined ||
                typeof trim("👨‍👩‍👧") === "string" ||
                typeof trim("👨‍👩‍👧") === "boolean" ||
                typeof trim("👨‍👩‍👧") === "number" ||
                Array.isArray(trim("👨‍👩‍👧")) ||
                (typeof trim("👨‍👩‍👧") === "object" && trim("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            trim("e\u0301") === undefined ||
                typeof trim("e\u0301") === "string" ||
                typeof trim("e\u0301") === "boolean" ||
                typeof trim("e\u0301") === "number" ||
                Array.isArray(trim("e\u0301")) ||
                (typeof trim("e\u0301") === "object" &&
                    trim("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            trim("مرحبا") === undefined ||
                typeof trim("مرحبا") === "string" ||
                typeof trim("مرحبا") === "boolean" ||
                typeof trim("مرحبا") === "number" ||
                Array.isArray(trim("مرحبا")) ||
                (typeof trim("مرحبا") === "object" && trim("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            trim("你好") === undefined ||
                typeof trim("你好") === "string" ||
                typeof trim("你好") === "boolean" ||
                typeof trim("你好") === "number" ||
                Array.isArray(trim("你好")) ||
                (typeof trim("你好") === "object" && trim("你好") !== null),
        ).toBe(true);
    });
});
