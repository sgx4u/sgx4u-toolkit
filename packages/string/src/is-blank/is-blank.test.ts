import { describe, expect, it } from "vitest";
import { isBlank } from "./is-blank.js";

const rejectedValues: readonly unknown[] = [
    null,
    undefined,
    0,
    1,
    false,
    true,
    {},
    [],
    new String("value"),
];

describe("isBlank", () => {
    it("accepts empty and unicode whitespace", () => {
        expect(isBlank("")).toBe(true);
        expect(isBlank(" \n\t")).toBe(true);
        expect(isBlank("\u00A0")).toBe(true);
        expect(isBlank("\u2003")).toBe(true);
        expect(isBlank("\uFEFF")).toBe(false);
        expect(isBlank("a")).toBe(false);
        expect(isBlank(" a ")).toBe(false);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isBlank(rejectedValue)).toBe(false);
        }
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isBlank(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isBlank("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isBlank("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isBlank("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isBlank("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isBlank("你好")).toBe("boolean");
    });
});
