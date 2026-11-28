import { describe, expect, it } from "vitest";
import { startsWith } from "./starts-with.js";
describe("startsWith", () => {
    it("checks the prefix", () => {
        expect(startsWith({ value: "hello", search: "he" })).toBe(true);
        expect(
            startsWith({ value: "hello", search: "HE", ignoreCase: true }),
        ).toBe(true);
        expect(startsWith({ value: "hello", search: "x" })).toBe(false);
        expect(startsWith({ value: "hello", search: "e", position: 1 })).toBe(
            true,
        );
        expect(startsWith({ value: "hello", search: "h", position: -1 })).toBe(
            true,
        );
        expect(startsWith({ value: "👨‍👩‍👧‍👦", search: "👨" })).toBe(false);
        expect(startsWith({ value: "hello", search: "" })).toBe(true);
        expect(startsWith({ value: 1 as unknown as string, search: "a" })).toBe(
            false,
        );
        expect(() =>
            startsWith({ value: "a", search: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(startsWith(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof startsWith({ value: "", search: "he" })).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof startsWith({ value: "👨‍👩‍👧", search: "he" })).toBe(
            "boolean",
        );
    });
    it("accepts a combining mark", () => {
        expect(typeof startsWith({ value: "e\u0301", search: "he" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof startsWith({ value: "مرحبا", search: "he" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof startsWith({ value: "你好", search: "he" })).toBe(
            "boolean",
        );
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            startsWith({ value: "hello", search: "he", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            startsWith({ value: "hello", search: "he", locale: 1 as never }),
        ).toThrow(TypeError);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            startsWith({ value: "hello", search: "he", unit: "nope" as never }),
        ).toThrow(RangeError);
    });
});
