import { describe, expect, it } from "vitest";
import { isString } from "./is-string.js";

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

describe("isString", () => {
    it("accepts every string primitive", () => {
        expect(isString("")).toBe(true);
        expect(isString("hello")).toBe(true);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isString(rejectedValue)).toBe(false);
        }
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isString(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isString("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isString("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isString("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isString("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isString("你好")).toBe("boolean");
    });
});
