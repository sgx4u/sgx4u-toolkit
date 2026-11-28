import { describe, expect, it } from "vitest";
import { isASCII } from "./is-ascii.js";

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

describe("isASCII", () => {
    it("checks the 0 through 127 range", () => {
        expect(isASCII("")).toBe(true);
        expect(isASCII("abc\n")).toBe(true);
        expect(isASCII("é")).toBe(false);
    });
    it("returns false for non-strings", () => {
        for (const rejectedValue of rejectedValues) {
            expect(isASCII(rejectedValue)).toBe(false);
        }
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isASCII(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isASCII("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isASCII("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isASCII("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isASCII("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isASCII("你好")).toBe("boolean");
    });
});
