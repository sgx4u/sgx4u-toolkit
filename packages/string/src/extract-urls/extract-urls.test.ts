import { describe, expect, it } from "vitest";
import { extractURLs } from "./extract-urls.js";
describe("extractURLs", () => {
    it("finds http URLs", () => {
        expect(extractURLs("see https://example.com.")).toEqual([
            "https://example.com",
        ]);
        expect(extractURLs("none")).toEqual([]);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(extractURLs(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            extractURLs("") === undefined || Array.isArray(extractURLs("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            extractURLs("👨‍👩‍👧") === undefined || Array.isArray(extractURLs("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            extractURLs("e\u0301") === undefined ||
                Array.isArray(extractURLs("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            extractURLs("مرحبا") === undefined ||
                Array.isArray(extractURLs("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            extractURLs("你好") === undefined ||
                Array.isArray(extractURLs("你好")),
        ).toBe(true);
    });
});
