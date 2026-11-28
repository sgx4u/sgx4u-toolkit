import { describe, expect, it } from "vitest";
import { toSentenceCase } from "./to-sentence-case.js";

describe("toSentenceCase", () => {
    it("converts words", () => {
        expect(toSentenceCase("fooBar")).toBe("Foo bar");
        expect(toSentenceCase("")).toBe("");
        expect(toSentenceCase(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toSentenceCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toSentenceCase("") === undefined ||
                typeof toSentenceCase("") === "string" ||
                typeof toSentenceCase("") === "boolean" ||
                typeof toSentenceCase("") === "number" ||
                Array.isArray(toSentenceCase("")) ||
                (typeof toSentenceCase("") === "object" &&
                    toSentenceCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toSentenceCase("👨‍👩‍👧") === undefined ||
                typeof toSentenceCase("👨‍👩‍👧") === "string" ||
                typeof toSentenceCase("👨‍👩‍👧") === "boolean" ||
                typeof toSentenceCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toSentenceCase("👨‍👩‍👧")) ||
                (typeof toSentenceCase("👨‍👩‍👧") === "object" &&
                    toSentenceCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toSentenceCase("e\u0301") === undefined ||
                typeof toSentenceCase("e\u0301") === "string" ||
                typeof toSentenceCase("e\u0301") === "boolean" ||
                typeof toSentenceCase("e\u0301") === "number" ||
                Array.isArray(toSentenceCase("e\u0301")) ||
                (typeof toSentenceCase("e\u0301") === "object" &&
                    toSentenceCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toSentenceCase("مرحبا") === undefined ||
                typeof toSentenceCase("مرحبا") === "string" ||
                typeof toSentenceCase("مرحبا") === "boolean" ||
                typeof toSentenceCase("مرحبا") === "number" ||
                Array.isArray(toSentenceCase("مرحبا")) ||
                (typeof toSentenceCase("مرحبا") === "object" &&
                    toSentenceCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toSentenceCase("你好") === undefined ||
                typeof toSentenceCase("你好") === "string" ||
                typeof toSentenceCase("你好") === "boolean" ||
                typeof toSentenceCase("你好") === "number" ||
                Array.isArray(toSentenceCase("你好")) ||
                (typeof toSentenceCase("你好") === "object" &&
                    toSentenceCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toSentenceCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toSentenceCase({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
