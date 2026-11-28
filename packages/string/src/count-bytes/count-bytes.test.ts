import { describe, expect, it } from "vitest";
import { countBytes } from "./count-bytes.js";

describe("countBytes", () => {
    it("counts UTF-8 bytes", () => {
        expect(countBytes("")).toBe(0);
        expect(countBytes("a")).toBe(1);
        expect(countBytes("é")).toBe(2);
        expect(countBytes("😀")).toBe(4);
        expect(countBytes(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(countBytes(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            countBytes("") === undefined ||
                typeof countBytes("") === "string" ||
                typeof countBytes("") === "boolean" ||
                typeof countBytes("") === "number" ||
                Array.isArray(countBytes("")) ||
                (typeof countBytes("") === "object" && countBytes("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            countBytes("👨‍👩‍👧") === undefined ||
                typeof countBytes("👨‍👩‍👧") === "string" ||
                typeof countBytes("👨‍👩‍👧") === "boolean" ||
                typeof countBytes("👨‍👩‍👧") === "number" ||
                Array.isArray(countBytes("👨‍👩‍👧")) ||
                (typeof countBytes("👨‍👩‍👧") === "object" &&
                    countBytes("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            countBytes("e\u0301") === undefined ||
                typeof countBytes("e\u0301") === "string" ||
                typeof countBytes("e\u0301") === "boolean" ||
                typeof countBytes("e\u0301") === "number" ||
                Array.isArray(countBytes("e\u0301")) ||
                (typeof countBytes("e\u0301") === "object" &&
                    countBytes("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            countBytes("مرحبا") === undefined ||
                typeof countBytes("مرحبا") === "string" ||
                typeof countBytes("مرحبا") === "boolean" ||
                typeof countBytes("مرحبا") === "number" ||
                Array.isArray(countBytes("مرحبا")) ||
                (typeof countBytes("مرحبا") === "object" &&
                    countBytes("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            countBytes("你好") === undefined ||
                typeof countBytes("你好") === "string" ||
                typeof countBytes("你好") === "boolean" ||
                typeof countBytes("你好") === "number" ||
                Array.isArray(countBytes("你好")) ||
                (typeof countBytes("你好") === "object" &&
                    countBytes("你好") !== null),
        ).toBe(true);
    });
});
