import { describe, expect, it } from "vitest";
import { equalsIgnoreCase } from "./equals-ignore-case.js";
describe("equalsIgnoreCase", () => {
    it("ignores case and keeps accents", () => {
        expect(equalsIgnoreCase({ first: "A", second: "a" })).toBe(true);
        expect(equalsIgnoreCase({ first: "é", second: "e" })).toBe(false);
        expect(equalsIgnoreCase({ first: "É", second: "é" })).toBe(true);
        expect(
            equalsIgnoreCase({ first: "i", second: "İ", locale: "tr" }),
        ).toBe(true);
        expect(
            equalsIgnoreCase({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(equalsIgnoreCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof equalsIgnoreCase({ first: "", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof equalsIgnoreCase({ first: "👨‍👩‍👧", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts a combining mark", () => {
        expect(typeof equalsIgnoreCase({ first: "e\u0301", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof equalsIgnoreCase({ first: "مرحبا", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof equalsIgnoreCase({ first: "你好", second: "a" })).toBe(
            "boolean",
        );
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            equalsIgnoreCase({ first: "A", second: "a", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            equalsIgnoreCase({ first: "A", second: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
