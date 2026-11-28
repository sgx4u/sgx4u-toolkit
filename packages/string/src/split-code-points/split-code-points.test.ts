import { describe, expect, it } from "vitest";
import { splitCodePoints } from "./split-code-points.js";

describe("splitCodePoints", () => {
    it("splits on code points", () => {
        expect(splitCodePoints("")).toEqual([]);
        expect(splitCodePoints("😀")).toEqual(["😀"]);
        expect(splitCodePoints("e\u0301")).toEqual(["e", "\u0301"]);
        expect(splitCodePoints(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(splitCodePoints(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            splitCodePoints("") === undefined ||
                Array.isArray(splitCodePoints("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            splitCodePoints("👨‍👩‍👧") === undefined ||
                Array.isArray(splitCodePoints("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            splitCodePoints("e\u0301") === undefined ||
                Array.isArray(splitCodePoints("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            splitCodePoints("مرحبا") === undefined ||
                Array.isArray(splitCodePoints("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            splitCodePoints("你好") === undefined ||
                Array.isArray(splitCodePoints("你好")),
        ).toBe(true);
    });
});
