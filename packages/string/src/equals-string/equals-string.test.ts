import { describe, expect, it } from "vitest";
import { equalsString } from "./equals-string.js";
describe("equalsString", () => {
    it("compares with a collator", () => {
        expect(equalsString({ first: "a", second: "a" })).toBe(true);
        expect(
            equalsString({ first: "a", second: "A", sensitivity: "accent" }),
        ).toBe(true);
        expect(
            equalsString({
                first: "café",
                second: "CAFÉ",
                sensitivity: "accent",
            }),
        ).toBe(true);
        expect(
            equalsString({
                first: "café",
                second: "cafe",
                sensitivity: "accent",
            }),
        ).toBe(false);
        expect(equalsString({ first: "a", second: "b" })).toBe(false);
        expect(
            equalsString({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
        expect(() =>
            equalsString({
                first: "a",
                second: "a",
                sensitivity: "nope" as "base",
            }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(equalsString(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof equalsString({ first: "", second: "a" })).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof equalsString({ first: "👨‍👩‍👧", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts a combining mark", () => {
        expect(typeof equalsString({ first: "e\u0301", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof equalsString({ first: "مرحبا", second: "a" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof equalsString({ first: "你好", second: "a" })).toBe(
            "boolean",
        );
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            equalsString({ first: "a", second: "a", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            equalsString({ first: "a", second: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
