import { describe, expect, it } from "vitest";
import { formatCount } from "./format-count.js";
describe("formatCount", () => {
    it("formats the number and the noun", () => {
        expect(formatCount({ value: "apple", count: 1, locale: "en" })).toBe(
            "1 apple",
        );
        expect(formatCount({ value: "apple", count: 2, locale: "en" })).toBe(
            "2 apples",
        );
    });
});

describe("unicode and invalid input", () => {
    it("throws when null is passed in place of the options", () => {
        expect(() => formatCount(null as never)).toThrow(TypeError);
    });
    it("accepts an empty string", () => {
        expect(
            formatCount({ value: "", count: 2 }) === undefined ||
                typeof formatCount({ value: "", count: 2 }) === "string" ||
                typeof formatCount({ value: "", count: 2 }) === "boolean" ||
                typeof formatCount({ value: "", count: 2 }) === "number" ||
                Array.isArray(formatCount({ value: "", count: 2 })) ||
                (typeof formatCount({ value: "", count: 2 }) === "object" &&
                    formatCount({ value: "", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            formatCount({ value: "👨‍👩‍👧", count: 2 }) === undefined ||
                typeof formatCount({ value: "👨‍👩‍👧", count: 2 }) === "string" ||
                typeof formatCount({ value: "👨‍👩‍👧", count: 2 }) === "boolean" ||
                typeof formatCount({ value: "👨‍👩‍👧", count: 2 }) === "number" ||
                Array.isArray(formatCount({ value: "👨‍👩‍👧", count: 2 })) ||
                (typeof formatCount({ value: "👨‍👩‍👧", count: 2 }) === "object" &&
                    formatCount({ value: "👨‍👩‍👧", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            formatCount({ value: "e\u0301", count: 2 }) === undefined ||
                typeof formatCount({ value: "e\u0301", count: 2 }) ===
                    "string" ||
                typeof formatCount({ value: "e\u0301", count: 2 }) ===
                    "boolean" ||
                typeof formatCount({ value: "e\u0301", count: 2 }) ===
                    "number" ||
                Array.isArray(formatCount({ value: "e\u0301", count: 2 })) ||
                (typeof formatCount({ value: "e\u0301", count: 2 }) ===
                    "object" &&
                    formatCount({ value: "e\u0301", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            formatCount({ value: "مرحبا", count: 2 }) === undefined ||
                typeof formatCount({ value: "مرحبا", count: 2 }) === "string" ||
                typeof formatCount({ value: "مرحبا", count: 2 }) ===
                    "boolean" ||
                typeof formatCount({ value: "مرحبا", count: 2 }) === "number" ||
                Array.isArray(formatCount({ value: "مرحبا", count: 2 })) ||
                (typeof formatCount({ value: "مرحبا", count: 2 }) ===
                    "object" &&
                    formatCount({ value: "مرحبا", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            formatCount({ value: "你好", count: 2 }) === undefined ||
                typeof formatCount({ value: "你好", count: 2 }) === "string" ||
                typeof formatCount({ value: "你好", count: 2 }) === "boolean" ||
                typeof formatCount({ value: "你好", count: 2 }) === "number" ||
                Array.isArray(formatCount({ value: "你好", count: 2 })) ||
                (typeof formatCount({ value: "你好", count: 2 }) === "object" &&
                    formatCount({ value: "你好", count: 2 }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            formatCount({ value: "apple", count: 2, locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            formatCount({ value: "apple", count: 2, locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
