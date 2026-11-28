import { describe, expect, it } from "vitest";
import { includes } from "./includes.js";
describe("includes", () => {
    it("searches", () => {
        expect(includes({ value: "hello", search: "ell" })).toBe(true);
        expect(
            includes({ value: "hello", search: "ELL", ignoreCase: true }),
        ).toBe(true);
        expect(includes({ value: "hello", search: "x" })).toBe(false);
        expect(includes({ value: 1 as unknown as string, search: "a" })).toBe(
            false,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(includes(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof includes({ value: "", search: "ell" })).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof includes({ value: "👨‍👩‍👧", search: "ell" })).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof includes({ value: "e\u0301", search: "ell" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof includes({ value: "مرحبا", search: "ell" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof includes({ value: "你好", search: "ell" })).toBe(
            "boolean",
        );
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            includes({ value: "hello", search: "ell", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            includes({ value: "hello", search: "ell", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
