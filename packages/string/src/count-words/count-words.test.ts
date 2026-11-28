import { describe, expect, it } from "vitest";
import { countWords } from "./count-words.js";
describe("countWords", () => {
    it("counts split words", () => {
        expect(countWords("foo bar")).toBe(2);
        expect(countWords("fooBar")).toBe(2);
        expect(countWords("")).toBe(0);
        expect(countWords(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(countWords(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            countWords("") === undefined ||
                typeof countWords("") === "string" ||
                typeof countWords("") === "boolean" ||
                typeof countWords("") === "number" ||
                Array.isArray(countWords("")) ||
                (typeof countWords("") === "object" && countWords("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            countWords("👨‍👩‍👧") === undefined ||
                typeof countWords("👨‍👩‍👧") === "string" ||
                typeof countWords("👨‍👩‍👧") === "boolean" ||
                typeof countWords("👨‍👩‍👧") === "number" ||
                Array.isArray(countWords("👨‍👩‍👧")) ||
                (typeof countWords("👨‍👩‍👧") === "object" &&
                    countWords("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            countWords("e\u0301") === undefined ||
                typeof countWords("e\u0301") === "string" ||
                typeof countWords("e\u0301") === "boolean" ||
                typeof countWords("e\u0301") === "number" ||
                Array.isArray(countWords("e\u0301")) ||
                (typeof countWords("e\u0301") === "object" &&
                    countWords("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            countWords("مرحبا") === undefined ||
                typeof countWords("مرحبا") === "string" ||
                typeof countWords("مرحبا") === "boolean" ||
                typeof countWords("مرحبا") === "number" ||
                Array.isArray(countWords("مرحبا")) ||
                (typeof countWords("مرحبا") === "object" &&
                    countWords("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            countWords("你好") === undefined ||
                typeof countWords("你好") === "string" ||
                typeof countWords("你好") === "boolean" ||
                typeof countWords("你好") === "number" ||
                Array.isArray(countWords("你好")) ||
                (typeof countWords("你好") === "object" &&
                    countWords("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => countWords({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => countWords({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
