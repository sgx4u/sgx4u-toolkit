import { describe, expect, it } from "vitest";
import { includesAll } from "./includes-all.js";
describe("includesAll", () => {
    it("requires every search", () => {
        expect(includesAll({ value: "hello", searches: ["he", "lo"] })).toBe(
            true,
        );
        expect(includesAll({ value: "hello", searches: ["he", "x"] })).toBe(
            false,
        );
        expect(
            includesAll({ value: 1 as unknown as string, searches: ["a"] }),
        ).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(includesAll(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof includesAll({ value: "", searches: ["he", "lo"] })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            typeof includesAll({ value: "👨‍👩‍👧", searches: ["he", "lo"] }),
        ).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(
            typeof includesAll({ value: "e\u0301", searches: ["he", "lo"] }),
        ).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(
            typeof includesAll({ value: "مرحبا", searches: ["he", "lo"] }),
        ).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(
            typeof includesAll({ value: "你好", searches: ["he", "lo"] }),
        ).toBe("boolean");
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            includesAll({ value: "hello", searches: ["he", "lo"], locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            includesAll({
                value: "hello",
                searches: ["he", "lo"],
                locale: 1 as never,
            }),
        ).toThrow(TypeError);
    });
});
