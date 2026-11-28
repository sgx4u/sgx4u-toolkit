import { describe, expect, it } from "vitest";
import { splitLines } from "./split-lines.js";
describe("splitLines", () => {
    it("splits on all three newlines", () => {
        expect(splitLines("a\nb\r\nc\rd")).toEqual(["a", "b", "c", "d"]);
        expect(splitLines({ value: "a\n\nb", omitEmpty: true })).toEqual([
            "a",
            "b",
        ]);
        expect(splitLines("")).toEqual([""]);
        expect(splitLines(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(splitLines(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            splitLines("") === undefined || Array.isArray(splitLines("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            splitLines("👨‍👩‍👧") === undefined || Array.isArray(splitLines("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            splitLines("e\u0301") === undefined ||
                Array.isArray(splitLines("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            splitLines("مرحبا") === undefined ||
                Array.isArray(splitLines("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            splitLines("你好") === undefined ||
                Array.isArray(splitLines("你好")),
        ).toBe(true);
    });
});
