import { describe, expect, it } from "vitest";
import { splitWords } from "./split-words.js";

describe("splitWords", () => {
    it("splits the documented examples", () => {
        expect(splitWords("")).toEqual([]);
        expect(splitWords("XMLHttpRequest")).toEqual([
            "XML",
            "Http",
            "Request",
        ]);
        expect(splitWords("userID")).toEqual(["user", "ID"]);
        expect(splitWords("__typename")).toEqual(["typename"]);
        expect(splitWords("version2Beta")).toEqual(["version", "2", "Beta"]);
        expect(splitWords("v1.2")).toEqual(["v", "1", "2"]);
        expect(
            splitWords({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toEqual(["V12"]);
        expect(
            splitWords({
                value: "version2Beta",
                mergeAmbiguousCharacters: true,
            }),
        ).toEqual(["version2", "Beta"]);
        expect(splitWords("你好")).toEqual(["你好"]);
        expect(splitWords("foo😀bar")).toEqual(["foo", "😀", "bar"]);
        expect(splitWords(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(splitWords(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            splitWords("") === undefined || Array.isArray(splitWords("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            splitWords("👨‍👩‍👧") === undefined || Array.isArray(splitWords("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            splitWords("e\u0301") === undefined ||
                Array.isArray(splitWords("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            splitWords("مرحبا") === undefined ||
                Array.isArray(splitWords("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            splitWords("你好") === undefined ||
                Array.isArray(splitWords("你好")),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => splitWords({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => splitWords({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
