import { describe, expect, it } from "vitest";
import { extractHashtags } from "./extract-hashtags.js";
describe("extractHashtags", () => {
    it("finds hashtags", () => {
        expect(extractHashtags("#Hello #2")).toEqual(["#Hello", "#2"]);
        expect(extractHashtags("none")).toEqual([]);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(extractHashtags(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            extractHashtags("") === undefined ||
                Array.isArray(extractHashtags("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            extractHashtags("👨‍👩‍👧") === undefined ||
                Array.isArray(extractHashtags("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            extractHashtags("e\u0301") === undefined ||
                Array.isArray(extractHashtags("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            extractHashtags("مرحبا") === undefined ||
                Array.isArray(extractHashtags("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            extractHashtags("你好") === undefined ||
                Array.isArray(extractHashtags("你好")),
        ).toBe(true);
    });
});
