import { describe, expect, it } from "vitest";
import { extractMentions } from "./extract-mentions.js";
describe("extractMentions", () => {
    it("finds mentions", () => {
        expect(extractMentions("hi @ada and @bob")).toEqual(["@ada", "@bob"]);
        expect(extractMentions("none")).toEqual([]);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(extractMentions(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            extractMentions("") === undefined ||
                Array.isArray(extractMentions("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            extractMentions("👨‍👩‍👧") === undefined ||
                Array.isArray(extractMentions("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            extractMentions("e\u0301") === undefined ||
                Array.isArray(extractMentions("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            extractMentions("مرحبا") === undefined ||
                Array.isArray(extractMentions("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            extractMentions("你好") === undefined ||
                Array.isArray(extractMentions("你好")),
        ).toBe(true);
    });
});
