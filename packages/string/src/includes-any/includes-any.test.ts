import { describe, expect, it } from "vitest";
import { includesAny } from "./includes-any.js";
describe("includesAny", () => {
    it("accepts one match", () => {
        expect(includesAny({ value: "hello", searches: ["x", "ell"] })).toBe(
            true,
        );
        expect(includesAny({ value: "hello", searches: [] })).toBe(false);
        expect(
            includesAny({ value: 1 as unknown as string, searches: ["a"] }),
        ).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(includesAny(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof includesAny({ value: "", searches: ["x", "ell"] })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            typeof includesAny({ value: "👨‍👩‍👧", searches: ["x", "ell"] }),
        ).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(
            typeof includesAny({ value: "e\u0301", searches: ["x", "ell"] }),
        ).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(
            typeof includesAny({ value: "مرحبا", searches: ["x", "ell"] }),
        ).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(
            typeof includesAny({ value: "你好", searches: ["x", "ell"] }),
        ).toBe("boolean");
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            includesAny({ value: "hello", searches: ["x", "ell"], locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            includesAny({
                value: "hello",
                searches: ["x", "ell"],
                locale: 1 as never,
            }),
        ).toThrow(TypeError);
    });
});
