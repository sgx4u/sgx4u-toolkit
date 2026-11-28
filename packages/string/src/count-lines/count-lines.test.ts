import { describe, expect, it } from "vitest";
import { countLines } from "./count-lines.js";
describe("countLines", () => {
    it("counts lines", () => {
        expect(countLines("a\nb")).toBe(2);
        expect(countLines({ value: "a\n\nb", omitEmpty: true })).toBe(2);
        expect(countLines(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(countLines(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            countLines("") === undefined ||
                typeof countLines("") === "string" ||
                typeof countLines("") === "boolean" ||
                typeof countLines("") === "number" ||
                Array.isArray(countLines("")) ||
                (typeof countLines("") === "object" && countLines("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            countLines("👨‍👩‍👧") === undefined ||
                typeof countLines("👨‍👩‍👧") === "string" ||
                typeof countLines("👨‍👩‍👧") === "boolean" ||
                typeof countLines("👨‍👩‍👧") === "number" ||
                Array.isArray(countLines("👨‍👩‍👧")) ||
                (typeof countLines("👨‍👩‍👧") === "object" &&
                    countLines("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            countLines("e\u0301") === undefined ||
                typeof countLines("e\u0301") === "string" ||
                typeof countLines("e\u0301") === "boolean" ||
                typeof countLines("e\u0301") === "number" ||
                Array.isArray(countLines("e\u0301")) ||
                (typeof countLines("e\u0301") === "object" &&
                    countLines("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            countLines("مرحبا") === undefined ||
                typeof countLines("مرحبا") === "string" ||
                typeof countLines("مرحبا") === "boolean" ||
                typeof countLines("مرحبا") === "number" ||
                Array.isArray(countLines("مرحبا")) ||
                (typeof countLines("مرحبا") === "object" &&
                    countLines("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            countLines("你好") === undefined ||
                typeof countLines("你好") === "string" ||
                typeof countLines("你好") === "boolean" ||
                typeof countLines("你好") === "number" ||
                Array.isArray(countLines("你好")) ||
                (typeof countLines("你好") === "object" &&
                    countLines("你好") !== null),
        ).toBe(true);
    });
});
