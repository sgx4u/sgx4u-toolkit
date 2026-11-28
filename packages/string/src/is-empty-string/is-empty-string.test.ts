import { describe, expect, it } from "vitest";
import { isEmptyString } from "./is-empty-string.js";

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

describe("isEmptyString", () => {
    it("is true only for the empty string", () => {
        expect(isEmptyString("")).toBe(true);
        expect(isEmptyString(" ")).toBe(false);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isEmptyString(rejectedValue)).toBe(false);
        }
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isEmptyString(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isEmptyString("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isEmptyString("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isEmptyString("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isEmptyString("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isEmptyString("你好")).toBe("boolean");
    });
});
