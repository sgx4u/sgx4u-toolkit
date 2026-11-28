import { describe, expect, it } from "vitest";
import { endsWith } from "./ends-with.js";
describe("endsWith", () => {
    it("checks the suffix", () => {
        expect(endsWith({ value: "hello", search: "lo" })).toBe(true);
        expect(
            endsWith({ value: "hello", search: "LO", ignoreCase: true }),
        ).toBe(true);
        expect(endsWith({ value: "hello", search: "x" })).toBe(false);
        expect(endsWith({ value: "hello", search: "h", position: -1 })).toBe(
            false,
        );
        expect(endsWith({ value: "hello", search: "", position: -1 })).toBe(
            true,
        );
        expect(endsWith({ value: "hello", search: "hell", position: 4 })).toBe(
            true,
        );
        expect(endsWith({ value: "👨‍👩‍👧‍👦", search: "👦" })).toBe(false);
        expect(endsWith({ value: 1 as unknown as string, search: "a" })).toBe(
            false,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(endsWith(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof endsWith({ value: "", search: "lo" })).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof endsWith({ value: "👨‍👩‍👧", search: "lo" })).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof endsWith({ value: "e\u0301", search: "lo" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof endsWith({ value: "مرحبا", search: "lo" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof endsWith({ value: "你好", search: "lo" })).toBe(
            "boolean",
        );
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            endsWith({ value: "hello", search: "lo", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            endsWith({ value: "hello", search: "lo", locale: 1 as never }),
        ).toThrow(TypeError);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            endsWith({ value: "hello", search: "lo", unit: "nope" as never }),
        ).toThrow(RangeError);
    });
});
