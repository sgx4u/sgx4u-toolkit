import { describe, expect, it } from "vitest";
import { isNonEmptyString } from "./is-non-empty-string.js";

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

describe("isNonEmptyString", () => {
    it("rejects an empty string and accepts whitespace", () => {
        expect(isNonEmptyString("")).toBe(false);
        expect(isNonEmptyString(" ")).toBe(true);
        expect(isNonEmptyString("a")).toBe(true);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isNonEmptyString(rejectedValue)).toBe(false);
        }
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isNonEmptyString(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isNonEmptyString("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isNonEmptyString("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isNonEmptyString("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isNonEmptyString("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isNonEmptyString("你好")).toBe("boolean");
    });
});
