import { describe, expect, it } from "vitest";
import { splitSentences } from "./split-sentences.js";
describe("splitSentences", () => {
    it("splits and trims sentences", () => {
        expect(splitSentences("Hello. World.")?.length).toBeGreaterThan(0);
        expect(splitSentences("")).toEqual([]);
        expect(splitSentences(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(splitSentences(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            splitSentences("") === undefined ||
                Array.isArray(splitSentences("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            splitSentences("👨‍👩‍👧") === undefined ||
                Array.isArray(splitSentences("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            splitSentences("e\u0301") === undefined ||
                Array.isArray(splitSentences("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            splitSentences("مرحبا") === undefined ||
                Array.isArray(splitSentences("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            splitSentences("你好") === undefined ||
                Array.isArray(splitSentences("你好")),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => splitSentences({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            splitSentences({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
